import { invoke } from "@tauri-apps/api";
import { confirm } from "@tauri-apps/api/dialog";
import { readTextFile } from "@tauri-apps/api/fs";
import { resolve } from "@tauri-apps/api/path";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Animate } from "react-simple-animate";
import { utils, writeFileXLSX } from "xlsx";
import HeaderBar from "../../../components/HeaderBar";
import LoadingThrobber from "../../../components/LoadingThrobber";
import { EventData, EventType, IndividualData, TeamData } from "../../../types.d";

const sleep = (ms: number) => {
	return new Promise((r) => {
		setTimeout(() => {
			r(true);
		}, ms);
	});
};

export const AdminFinaliseEnd = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [ready, setReady] = React.useState(false);

	const [data, setData] = React.useState<{
		events: {
			id: number;
			participants: (TeamData | IndividualData)[];
			event: EventData;
			results: {
				participant: TeamData | IndividualData;
				position: number;
				points: number;
			}[];
		}[];
		results: {
			[key: string]: {
				position: number;
				participant: TeamData | IndividualData;
				points: number;
			}[];
		};
	}>();

	const [dataDir, setDataDir] = React.useState("");

	const getGeneratedJSON = async () => {
		const _dataDir = sessionStorage.getItem("latest_data_dir");

		if (_dataDir) {
			const jsonFilePath = await resolve(_dataDir, "generated.json");
			const rawData = await readTextFile(jsonFilePath);

			const parsed = JSON.parse(rawData);

			setData(parsed);

			setDataDir(_dataDir);
			sessionStorage.removeItem("latest_data_dir");
		} else {
			// alert(
			// 	"Unable to find generated data directory. Are you sure you got here from finalise mode?"
			// );
			// navigate("/");
		}
	};

	const getExcelSpreadsheet = () => {
		console.log(data);

		const ws = utils.json_to_sheet([]);
		const wb = utils.book_new();
		utils.book_append_sheet(wb, ws, "Students Tournament - Results");
		writeFileXLSX(wb, "generated.xlsx");
	};

	React.useEffect(() => {
		getGeneratedJSON();
	}, [location, location.state]);

	React.useEffect(() => {
		if (data !== undefined) {
			const getAllPromises = () => Promise.all([getExcelSpreadsheet()]);

			getAllPromises().then(async (_) => {
				await sleep(1500);

				setReady(true);
			});
		}
	}, [data]);

	return ready && data ? (
		<div className={"final-end-app"}>
			<HeaderBar
				title={""}
				exit={async (el: any) => {
					const reply = await confirm(
						"Are you sure you want to go back to the home screen?",
						{ type: "warning" }
					);

					if (reply == true) {
						navigate("/");
					}
				}}
			/>

			<div className={"final-end-container"}>
				<div className={"winner-podium"}>
					{(() => {
						const results = [...data.results.teams, ...data.results.individuals]
							.sort((a, b) => b.points - a.points)
							.slice(0, 3);

						return [
							{ ...results[1], position: 2 },
							{ ...results[0], position: 1 },
							{ ...results[2], position: 3 }
						];
					})().map((t, index) => (
						<Animate
							play
							duration={1}
							start={{ opacity: 0, transform: "translateY(50px)" }}
							end={{ opacity: 1, transform: "translateY(0px)" }}
							easeType={"ease-out"}
							delay={t.position == 1 ? 3 : 1.25 * 3 - 1 * t.position}
						>
							<div className={"podium"}>
								<div className={"details"}>
									<span>
										{
											data.events.filter((e) =>
												t.participant.events_ids_entered.includes(
													e.event.id
												)
											)[0].event.kind
										}
									</span>
									<span className={"name"}>{t.participant.name}</span>
								</div>
								<div className={"position"}>{t.position}</div>
							</div>
						</Animate>
					))}
				</div>

				<Animate
					play
					duration={0.75}
					start={{ opacity: 0, transform: "translateY(50px)" }}
					end={{ opacity: 1, transform: "translateY(0px)" }}
					easeType={"ease-out"}
					delay={4}
				>
					<div
						className={"table-grid winner-table"}
						id={"winner-table"}
						style={
							{
								"--col-template": "3rem 3rem repeat(5, 1fr)",
								position: "relative"
							} as any
						}
					>
						<div className={"head"}>
							<div
								className={"col"}
								title={"Overall Position"}
								style={{
									cursor: "help",
									textDecoration: "underline",
									textDecorationStyle: "dotted"
								}}
							>
								#
							</div>
							<div
								className={"col"}
								title={"Position in team/individual type"}
								style={{
									cursor: "help",
									textDecoration: "underline",
									textDecorationStyle: "dotted"
								}}
							>
								##
							</div>
							<div className={"col"}>Participant Name</div>
							<div className={"col"}>Participant Type</div>
							<div className={"col"}>Events Entered</div>
							<div className={"col"}>Scored Highest At</div>
							<div className={"col"}>Total Points</div>
						</div>

						<div className={"body"}>
							{[...data.results.teams, ...data.results.individuals]
								.sort((a, b) => b.points - a.points)
								.map((t, index) => (
									<div className={"row"}>
										<div className={"col"}>{index + 1}</div>
										<div
											className={"col"}
											data-type-rank={
												(data.events.filter((e) =>
													t.participant.events_ids_entered.includes(
														e.event.id
													)
												)[0].event.kind == EventType.Individual
													? data.results.individuals
													: data.results.teams
												)
													.sort((a, b) => b.points - a.points)
													.findIndex((i) => i.points == t.points) + 1
											}
										>
											{(data.events.filter((e) =>
												t.participant.events_ids_entered.includes(
													e.event.id
												)
											)[0].event.kind == EventType.Individual
												? data.results.individuals
												: data.results.teams
											)
												.sort((a, b) => b.points - a.points)
												.findIndex((i) => i.points == t.points) + 1}
										</div>
										<div className={"col"}>{t.participant.name}</div>
										<div className={"col"}>
											{
												data.events.filter((e) =>
													t.participant.events_ids_entered.includes(
														e.event.id
													)
												)[0].event.kind
											}
										</div>
										<div className={"col"}>
											{t.participant.events_ids_entered.length}
										</div>
										<div className={"col"}>
											{
												data.events
													.filter((e) =>
														t.participant.events_ids_entered.includes(
															e.event.id
														)
													)
													.map((e) => ({
														event: e.event.name,
														points:
															e.results.find(
																(r) =>
																	r.participant.id ==
																	t.participant.id
															)?.points || 0
													}))
													.sort((a, b) => a.points - b.points)[0].event
											}
										</div>
										<div className={"col"}>{t.points}</div>
									</div>
								))}
						</div>
					</div>
				</Animate>
			</div>

			<header className={"header-bar"}>
				<div className={"header-bar-container"}>
					<div className={"header-bar-button-container"}>
						<div className={"header-bar-button-container button-horiz"}>
							<button
								className={"btn secondary small"}
								onClick={async () => {
									await invoke("open_folder", {
										path: dataDir + "/"
									});
								}}
							>
								Open data folder
							</button>
						</div>
					</div>

					<div className={"header-bar-button-container"}>
						<div className={"header-bar-button-container button-horiz"}></div>
					</div>
				</div>
			</header>

			<iframe id="print_table" name="print_table"></iframe>
		</div>
	) : (
		<LoadingThrobber />
	);
};
