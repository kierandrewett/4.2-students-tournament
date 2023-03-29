import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderBar from "../../../components/HeaderBar";
import { CheckIcon } from "../../../components/icons/Check";
import Sidebar from "../../../components/Sidebar";
import { store } from "../../../store";
import { EventData, EventType, IndividualData, TeamData } from "../../../types.d";
import { AdminFinaliseRecordEvent } from "./record_event";

export const AdminFinalise = (
	rest: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
	const navigate = useNavigate();
	const location = useLocation();

	const [navState, setNavState] = React.useState([false, false]);

	const [allTeams, setAllTeams] = React.useState<TeamData[]>([]);
	const [allIndividuals, setAllIndividuals] = React.useState<IndividualData[]>([]);
	const [allEvents, setAllEvents] = React.useState<EventData[]>([]);

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

	React.useEffect(() => {
		const getAllPromises = () =>
			Promise.all([getAllEvents(), getAllIndividuals(), getAllTeams()]);

		getAllPromises();
	}, []);

	const [completedTabs, setCompletedTabs] = React.useState<string[]>([]);
	const [tabSelected, setTabSelected] = React.useState<any>("");

	const tabs = (
		[
			{
				id: "indi-events",
				name: "Individual events",
				disabled: true,
				render: () => <></>
			}
		] as any
	)
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
		)
		.concat([
			{
				id: "team-events",
				name: "Team events",
				disabled: true,
				render: () => <></>
			}
		])
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
		);

	return (
		<div className={"finalise-create-app"}>
			<Sidebar
				title={() => `Events (${new Set(completedTabs).size}/${tabs.length - 2}) `}
				tabs={tabs}
				state={[tabSelected, setTabSelected]}
				goBack={() => {}}
				goBackProps={{ disabled: !navState[0] }}
				goForward={() => {}}
				goForwardProps={{ disabled: !navState[1] }}
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
				ok={() => {}}
				okText={"Create final results"}
				okProps={{
					className: "btn primary small",
					disabled: !(new Set(completedTabs).size >= tabs.length - 2)
				}}
			/>
		</div>
	);
};
