import { arrayMoveImmutable } from "array-move";
import React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import HeaderBar from "../../../components/HeaderBar";
import { calculatePointsForRank } from "../../../scoring";
import { store } from "../../../store";
import { EventData, EventType, IndividualData, TeamData } from "../../../types.d";

type RSIProps = {
	event: EventData;
	value: TeamData | IndividualData;
	i: number;
	items: TeamData[] | IndividualData[];
};

// Ranking sort item component
// Used to render each item in the table
const RankingsSortItem = SortableElement<RSIProps>(({ event, value, i, items }: RSIProps) => {
	const [points, setPoints] = React.useState<any>("");

	React.useEffect(() => {
		const calculatedPoints = calculatePointsForRank({ event, position: i + 1 });

		let int: any;

		if (items.length <= 1) {
			setPoints(calculatedPoints);
		} else {
			setPoints("...");

			let int = setTimeout(() => {
				setPoints(calculatedPoints);
			}, 200);
		}

		store.results.call("record_event_results", {
			eventId: event.id,
			results: items.map((item, indx) => ({
				participant_id: item.id,
				position: indx + 1,
				points: calculatePointsForRank({ event, position: indx + 1 })
			}))
		});

		return () => {
			int && clearTimeout(int);
		};
	}, [items]);

	return (
		<div
			className={"row"}
			key={value.id}
			style={
				{
					position: "relative",
					"--col-template": "3rem 1fr 1fr",
					pointerEvents: points == "..." || items.length <= 1 ? "none" : ""
				} as any
			}
		>
			<div className={"col"} style={{ visibility: "hidden" }}>
				{i + 1}
			</div>
			<div className={"col"}>{value.name}</div>
			<div className={"col"}>{points}</div>
		</div>
	);
});

type RSCProps = { event: EventData; items: TeamData[] | IndividualData[]; isDone: boolean };

// Ranking sort container component
// Used to render the whole table
const RankingsSortContainer = SortableContainer<RSCProps>(({ event, items, isDone }: RSCProps) => {
	return (
		<div
			className={"body"}
			style={{
				position: "relative",
				pointerEvents: isDone ? "none" : "auto",
				opacity: isDone ? 0.5 : 1
			}}
		>
			{items.map((value, index) => (
				<RankingsSortItem
					key={value.id}
					index={index}
					i={index}
					value={value}
					event={event}
					items={items}
				/>
			))}
		</div>
	);
});

// Record event results component
// Includes complex sidebars and header bars to keep track of progress when recording
// Ability to mark each event as done is handy as it allows the user to go back and edit and track what has been done
const Rankings = ({
	participants,
	setParticipants,
	event,
	isDone
}: {
	participants: TeamData[] | IndividualData[];
	setParticipants: any;
	event: EventData;
	isDone: boolean;
}) => {
	const [sort, setSort] = React.useState(participants);

	React.useEffect(() => {
		if (sort.length == 0) {
			setSort(participants);
		}
	}, [participants]);

	return (
		<RankingsSortContainer
			onSortEnd={({ oldIndex, newIndex }) => {
				let newData = arrayMoveImmutable(sort, oldIndex, newIndex);

				setSort(newData);
				setParticipants(newData);
			}}
			lockAxis={"y"}
			event={event}
			items={sort}
			lockToContainerEdges={true}
			lockOffset={10}
			helperClass={"floating-row"}
			isDone={isDone}
		/>
	);
};

export const AdminFinaliseRecordEvent = ({
	id,
	visible,
	event,
	state
}: {
	id: string;
	visible: boolean;
	event: EventData;
	state: { [key: string]: [any, (v: any) => void] };
}) => {
	const [completedTabs, setCompletedTabs] = state.doneTabs;
	const [tabSelected, setTabSelected] = state.selectedTab;

	const [participants, setParticipants] = React.useState<TeamData[] | IndividualData[]>([]);

	const getAllTeams = async () => {
		return store.teams.call<TeamData[]>("get_all_teams").then((res) => {
			setParticipants(res.filter((i) => i.events_ids_entered.includes(event.id)));
		});
	};

	const getAllIndividuals = async () => {
		return store.individuals.call<IndividualData[]>("get_all_individuals").then((res) => {
			setParticipants(res.filter((i) => i.events_ids_entered.includes(event.id)));
		});
	};

	React.useEffect(() => {
		if (visible) {
			if (event.kind == EventType.Individual) {
				getAllIndividuals();
			} else if (event.kind == EventType.Team) {
				getAllTeams();
			}
		}
	}, [visible]);

	const tableRef = React.createRef<HTMLDivElement>();

	return (
		<div className={"teams-create-app"} style={{ display: visible ? "" : "none" }}>
			<HeaderBar
				title={"Results for " + event.name}
				cancel={() => {}}
				cancelProps={{
					className: "btn",
					style: { marginInlineStart: "0.5rem", fontWeight: 600 }
				}}
				cancelText={event.kind == EventType.Individual ? "Individuals" : "Teams"}
				ok={() => {
					if (completedTabs.includes(id)) {
						let newTabs = completedTabs.filter((i: any) => i != id);

						setCompletedTabs(newTabs);
					} else {
						setCompletedTabs([...completedTabs, id]);

						let next = state.tabs[state.tabs.findIndex((t) => t.id == tabSelected) + 1];

						if (next) {
							if (!next.id.startsWith("ev-")) {
								next =
									state.tabs[
										state.tabs.findIndex((t) => t.id == tabSelected) + 2
									];
							}

							setTabSelected(next.id);
						}
					}
				}}
				okText={completedTabs.includes(id) ? "Unmark as done" : "Mark event as done"}
				okProps={{
					className: `btn ${completedTabs.includes(id) ? `secondary` : `primary`} small`
				}}
			/>

			<div className="intro-container record-container">
				<div className={"intro-whoami record-table-container"}>
					<div
						className={"table-grid is-record-table"}
						ref={tableRef}
						style={{ "--col-template": "3rem 1fr 1fr", position: "relative" } as any}
					>
						<div className={"head"}>
							<div className={"col"}>#</div>
							<div className={"col"}>
								{event.kind == EventType.Individual ? "Individual" : "Team Name"}
							</div>
							<div className={"col"}>Calculated Points</div>
						</div>

						<div
							className={"body fixed-id"}
							style={
								{
									position: "absolute",
									top: "3rem",
									zIndex: 0,
									width: "100%"
								} as any
							}
						>
							{[...Array(participants.length)].map((_, index) => (
								<div className={"row"} key={index}>
									<div className="col">{index + 1}</div>
									<div className="col"></div>
									<div className="col"></div>
								</div>
							))}
						</div>

						<Rankings
							participants={participants}
							setParticipants={setParticipants}
							event={event}
							isDone={completedTabs.includes(id)}
						/>
					</div>
				</div>

				<p
					style={{
						textAlign: "center",
						margin: "3rem auto",
						marginBottom: 0,
						maxWidth: "380px"
					}}
				>
					Rearrange {event.kind == EventType.Individual ? "the individuals" : "teams"}{" "}
					into correct ranking order, and mark as done when complete.
				</p>
			</div>
		</div>
	);
};
