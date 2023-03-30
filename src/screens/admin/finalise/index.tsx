import { invoke } from "@tauri-apps/api";
import { confirm } from "@tauri-apps/api/dialog";
import { createDir, writeFile } from "@tauri-apps/api/fs";
import { homeDir, resolve } from "@tauri-apps/api/path";
import { appWindow, LogicalSize } from "@tauri-apps/api/window";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderBar from "../../../components/HeaderBar";
import { CheckIcon } from "../../../components/icons/Check";
import Sidebar from "../../../components/Sidebar";
import { store } from "../../../store";
import { EventData, EventType, IndividualData, ResultData, TeamData } from "../../../types.d";
import { AdminFinaliseRecordEvent } from "./record_event";

const sleep = (ms: number) => {
	return new Promise((r) => {
		setTimeout(() => {
			r(true);
		}, ms);
	});
};

export const AdminFinalise = (
	rest: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
	const navigate = useNavigate();
	const location = useLocation();

	const [navState, setNavState] = React.useState([false, false]);

	const [allTeams, setAllTeams] = React.useState<TeamData[]>([]);
	const [allIndividuals, setAllIndividuals] = React.useState<IndividualData[]>([]);
	const [allEvents, setAllEvents] = React.useState<EventData[]>([]);
	const [allResults, setAllResults] = React.useState<ResultData[]>([]);

	const [isLoading, setIsLoading] = React.useState(false);

	const getAllTeams = async () => {
		return store.teams.call<TeamData[]>("get_all_teams").then((res) => {
			setAllTeams(res);
		});
	};

	const getAllIndividuals = async () => {
		return store.individuals.call<TeamData[]>("get_all_individuals").then((res) => {
			setAllIndividuals(res);
		});
	};

	const getAllEvents = async () => {
		return store.events.call<EventData[]>("get_all_events").then((res) => {
			setAllEvents(res);
		});
	};

	const getAllResults = async () => {
		return store.results.call<ResultData[]>("get_all_results").then((res) => {
			setAllResults(res);
		});
	};

	React.useEffect(() => {
		const getAllPromises = () =>
			Promise.all([getAllEvents(), getAllIndividuals(), getAllTeams(), getAllResults()]);

		getAllPromises().then((_) => {
			store.results.on("results_recorded", () => getAllPromises());
		});

		appWindow.setSize(new LogicalSize(1280, 720));
		appWindow.setMinSize(new LogicalSize(1280, 720));
	}, []);

	const [completedTabs, setCompletedTabs] = React.useState<string[]>([]);
	const [tabSelected, setTabSelected] = React.useState<any>("");

	React.useEffect(() => {
		getAllResults();
	}, [completedTabs]);

	const tabs = (
		[
			{
				id: "team-events",
				name: "Team events",
				disabled: true,
				render: () => <></>
			}
		] as any
	)
		.concat(
			...allEvents
				.filter((e) => e.kind == EventType.Team)
				.map((e) => ({
					id: `ev-${e.id}`,
					name: () => (
						<>
							<span style={{ textAlign: "left", width: "100%" }}>{e.name}</span>
							{completedTabs.includes(`ev-${e.id}`) && <CheckIcon />}
						</>
					),
					disabled: false,
					render: () => (
						<AdminFinaliseRecordEvent
							id={`ev-${e.id}`}
							event={e}
							visible={tabSelected == `ev-${e.id}`}
							state={{
								tabs,
								doneTabs: [completedTabs, setCompletedTabs],
								selectedTab: [tabSelected, setTabSelected]
							}}
						/>
					)
				}))
		)
		.concat([
			{
				id: "indi-events",
				name: "Individual events",
				disabled: true,
				render: () => <></>
			}
		])
		.concat(
			...allEvents
				.filter((e) => e.kind == EventType.Individual)
				.map((e) => ({
					id: `ev-${e.id}`,
					name: () => (
						<>
							<span style={{ textAlign: "left", width: "100%" }}>{e.name}</span>
							{completedTabs.includes(`ev-${e.id}`) && <CheckIcon />}
						</>
					),
					disabled: false,
					render: () => (
						<AdminFinaliseRecordEvent
							id={`ev-${e.id}`}
							event={e}
							visible={tabSelected == `ev-${e.id}`}
							state={{
								tabs,
								doneTabs: [completedTabs, setCompletedTabs],
								selectedTab: [tabSelected, setTabSelected]
							}}
						/>
					)
				}))
		);

	React.useEffect(() => {
		for (const tab of tabs.filter((t: any) => t.id.startsWith("ev-"))) {
			const id = +tab.id.split("ev-")[1];

			store.results.call("mark_event_done", {
				eventId: id,
				done: completedTabs.includes(tab.id)
			});
		}
	}, [completedTabs]);

	const onFinalResultsClick = async () => {
		setIsLoading(true);

		if (allResults.map((e) => e.event_id).length == allEvents.length) {
			const frozenResults = [...allResults];

			await getAllResults();
			const freshResults = [...allResults];

			const bigData: any = {
				events: [],
				results: {
					teams: [],
					individuals: []
				}
			};

			for (const result of frozenResults) {
				const event = allEvents.find((e) => e.id == result.event_id);

				if (event) {
					const storedData = freshResults.find((r) => r.event_id == result.event_id);

					if (storedData) {
						const participants =
							event.kind == EventType.Individual
								? allIndividuals
								: event.kind == EventType.Team
								? allTeams
								: [];
						const participantsOfEvent = participants.filter((p) =>
							p.events_ids_entered.includes(event.id)
						);

						bigData.events.push({
							id: bigData.events.length + 1,
							event,
							participants: participantsOfEvent,
							results: result.results.map((r) => ({
								participant: participants.filter((p) => p.id == r.participant_id),
								position: r.position,
								points: r.points
							}))
						});
					} else {
						alert("Data on disk no longer exists!");
						setIsLoading(false);
					}
				} else {
					alert("Failed to find event relating to current result!");
					setIsLoading(false);
				}
			}

			const generateTotaledScores = (participants: IndividualData[] | TeamData[]) =>
				participants
					.map((t) => {
						const resultsTeamIn = allResults
							.filter((r) => t.events_ids_entered.includes(r.event_id))
							.map((r) => r.results.find((r) => r.participant_id == t.id));

						const totalPoints = resultsTeamIn
							.map((r) => r?.points)
							.reduce((b: any, a: any) => (b || 0) + (a || 0), 0);

						return {
							participant: t,
							points: totalPoints
						};
					})
					.sort((a, b) => {
						return +b.points - +a.points;
					})
					.map((t, index) => ({
						...t,
						position: index + 1
					}));

			bigData.results.teams = generateTotaledScores(allTeams);
			bigData.results.individuals = generateTotaledScores(allIndividuals);

			const generatedDate = new Date();

			const generatedDirName = [
				generatedDate.getFullYear(),
				(generatedDate.getMonth() + 1).toString().padStart(2, "0"),
				generatedDate.getDate().toString().padStart(2, "0"),
				generatedDate.getHours().toString().padStart(2, "0"),
				generatedDate.getMinutes().toString().padStart(2, "0"),
				generatedDate.getSeconds().toString().padStart(2, "0")
			].join("-");

			bigData.generated_at = generatedDate.toISOString();

			const home = await homeDir();
			const dataDir = await resolve(
				home,
				".students_tournament",
				"generated",
				generatedDirName
			);

			sessionStorage.setItem("latest_data_dir", dataDir);

			await createDir(dataDir, { recursive: true });

			const jsonFilePath = await resolve(dataDir, "generated.json");

			await writeFile(jsonFilePath, JSON.stringify(bigData, null, 4));

			await sleep(1000);
			await invoke("unlock_data");

			navigate("/admin/finalise/end");
		} else {
			alert(
				"An error occurred while generating final results: mismatch between results events amount and all events amount."
			);
			setIsLoading(false);
		}
	};

	return (
		<div className={"finalise-app"}>
			<div
				className={"finalise-create-app"}
				style={{
					pointerEvents: isLoading ? "none" : "auto",
					opacity: isLoading ? 0.5 : 1
				}}
			>
				<Sidebar
					title={() => `Events (${new Set(completedTabs).size}/${tabs.length - 2}) `}
					exit={async (el: any) => {
						const reply = await confirm(
							"Are you sure you want to leave finalise mode? Your changes will NOT be saved.",
							{ type: "warning" }
						);

						if (reply == true) {
							store.results.call("reset_all").then((_) => {
								navigate("/");
							});
						}
					}}
					exitProps={{}}
					tabs={tabs}
					state={[tabSelected, setTabSelected]}
					classNames={{
						items: "final-items"
					}}
				>
					<div
						className={"teams-create-app"}
						style={{ display: tabSelected == "" ? "" : "none" }}
					>
						<HeaderBar />

						<div className="center-container intro-container">
							<div className={"intro-main intro-whoami center-container"}>
								<h1>Select an event</h1>
							</div>
						</div>
					</div>
				</Sidebar>
				<HeaderBar
					cancel={() => {}}
					cancelText={"Record the results for each event and mark them all as done."}
					cancelProps={{ className: "btn", style: { marginInlineStart: "0.5rem" } }}
					ok={() => onFinalResultsClick()}
					okText={isLoading ? "Loading..." : "Create final results"}
					okProps={{
						className: "btn primary small",
						disabled: !(new Set(completedTabs).size >= tabs.length - 2) || isLoading
					}}
				/>
			</div>
			{allTeams &&
			allTeams.length &&
			allEvents &&
			allEvents.length &&
			allIndividuals &&
			allIndividuals.length &&
			allResults &&
			allResults.length ? (
				<Sidebar
					title={() => `Overall Ranking`}
					tabs={[
						{
							id: "teams",
							name: "Teams",
							disabled: true,
							render: () => <></>
						}
					]
						.concat(
							allTeams
								.map((t) => {
									const resultsTeamIn = allResults
										.filter(
											(r) =>
												t.events_ids_entered.includes(r.event_id) &&
												completedTabs.includes(`ev-${r.event_id}`)
										)
										.map((r) =>
											r.results.find((r) => r.participant_id == t.id)
										);

									const totalPoints = resultsTeamIn
										.map((r) => r?.points)
										.reduce((b: any, a: any) => (b || 0) + (a || 0), 0);

									return {
										id: `t-${t.id}`,
										name: `${t.name} - ${totalPoints} points`,
										disabled: false,
										render: () => <></>
									};
								})
								.sort((a, b) => {
									return (
										+b.name.split(" - ")[1].split(" points")[0] -
										+a.name.split(" - ")[1].split(" points")[0]
									);
								})
								.map((t, index) => ({
									...t,
									name: `#${index + 1} - ${t.name}`
								}))
						)
						.concat([
							{
								id: "individuals",
								name: "Individuals",
								disabled: true,
								render: () => <></>
							}
						])
						.concat(
							allIndividuals
								.map((t) => {
									const resultsIndividualIn = allResults
										.filter(
											(r) =>
												t.events_ids_entered.includes(r.event_id) &&
												completedTabs.includes(`ev-${r.event_id}`)
										)
										.map((r) =>
											r.results.find((r) => r.participant_id == t.id)
										);

									const totalPoints = resultsIndividualIn
										.map((r) => r?.points)
										.reduce((b: any, a: any) => (b || 0) + (a || 0), 0);

									return {
										id: `i-${t.id}`,
										name: `${t.name} - ${totalPoints} points`,
										disabled: false,
										render: () => <></>
									};
								})
								.sort((a, b) => {
									return (
										+b.name.split(" - ")[1].split(" points")[0] -
										+a.name.split(" - ")[1].split(" points")[0]
									);
								})
								.map((t, index) => ({
									...t,
									name: `#${index + 1} - ${t.name}`
								}))
						)}
					state={["", () => {}]}
					animatedTabs={true}
					classNames={{
						root: "finalise-ranking-sidebar",
						items: "overall-ranking-items"
					}}
				/>
			) : (
				<></>
			)}
		</div>
	);
};
