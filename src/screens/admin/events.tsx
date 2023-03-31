import React from "react";
import { ChevronDownIcon } from "../../components/icons/ChevronDown";
import { CreateEventModal } from "../../modals/events/create";
import { store } from "../../store";
import { EventData, EventType, IndividualData, TeamData } from "../../types.d";

export const AdminEvents = (
	rest: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
	const [allEvents, setAllEvents] = React.useState<EventData[]>([]);
	const [allIndividuals, setAllIndividuals] = React.useState<IndividualData[]>([]);
	const [allTeams, setAllTeams] = React.useState<TeamData[]>([]);

	const [createEventModalOpen, setCreateEventModalOpen] = React.useState(false);

	const [tableVisible, setTableVisible] = React.useState<any>([]);

	const getAllEvents = async () => {
		return store.events.call<EventData[]>("get_all_events").then((res) => {
			setAllEvents(res);
		});
	};

	const getAllIndividuals = async () => {
		return store.individuals.call<IndividualData[]>("get_all_individuals").then((res) => {
			setAllIndividuals(res);
		});
	};

	const getAllTeams = async () => {
		return store.teams.call<TeamData[]>("get_all_teams").then((res) => {
			setAllTeams(res);
		});
	};

	React.useEffect(() => {
		const getAllPromises = () =>
			Promise.all([getAllEvents(), getAllIndividuals(), getAllTeams()]);

		getAllPromises().then((_) => {
			store.events.on("event_created", getAllPromises);
			store.events.on("event_deleted", getAllPromises);
			store.teams.on("team_created", getAllPromises);
			store.individuals.on("individual_created", getAllPromises);
		});

		window.addEventListener("focus", getAllPromises);
		window.addEventListener("blur", getAllPromises);
	}, []);

	return (
		<div {...rest} className="admin-container center-container">
			<div className={"admin-main center-container"}>
				<h1>Events</h1>
				<p>Create, modify or delete events</p>
			</div>

			<div className={"admin-main center-container"}>
				<h3>All Events</h3>

				<div className={"button-horiz"}>
					<div>
						<button
							className={"btn primary"}
							onClick={() => setCreateEventModalOpen(true)}
						>
							Create new event...
						</button>
						<CreateEventModal state={[createEventModalOpen, setCreateEventModalOpen]} />
					</div>
				</div>

				<table className={"table"}>
					<thead>
						<th>ID</th>
						<th>Name</th>
						<th>Type</th>
						<th>Max Points</th>
						<th>Required Participants/Teams</th>
						<th>Actions</th>
					</thead>
					<tbody>
						{allEvents.map((e, index) => (
							<>
								<tr key={index}>
									<td>{e.id}</td>
									<td>{e.name}</td>
									<td>
										{(() => {
											switch (e.kind) {
												case EventType.Individual:
													return "Individual";
												case EventType.Team:
													return "Team";
											}
										})()}
									</td>
									<td>{e.max_points}</td>
									<td>
										{e.kind == EventType.Team
											? e.max_teams || "Unlimited"
											: "Unlimited"}
									</td>
									<td className={"small"}>
										<button
											className={"btn danger small"}
											onClick={(el: any) => {
												if (
													(e.kind == EventType.Individual
														? allIndividuals
														: allTeams
													).filter((p) =>
														p.events_ids_entered.includes(e.id)
													).length
												) {
													alert(
														`Unable to delete event as other ${
															e.kind == EventType.Individual
																? "individuals"
																: "teams"
														} are already taking part in the event. Remove the event from the ${
															e.kind == EventType.Individual
																? "individuals"
																: "teams"
														} and then you can delete the event.`
													);
												} else {
													let int = setTimeout(() => {
														el.target.removeAttribute("data-sure");
														el.target.textContent = "Delete";
													}, 3000);

													if (el.target.hasAttribute("data-sure")) {
														store.events.call("delete_event", {
															id: e.id
														});
														clearTimeout(int);
													} else {
														el.target.setAttribute("data-sure", "");
														el.target.textContent = "Delete?";
													}
												}
											}}
										>
											Delete
										</button>
									</td>
								</tr>

								<tr className={"table"}>
									<td colSpan={6}>
										<button
											className={"btn small secondary"}
											style={{ margin: "0 auto", marginBottom: "1rem" }}
											onClick={() => {
												let updatedtableVisible = [...tableVisible];

												if (updatedtableVisible.includes(e.id)) {
													updatedtableVisible =
														updatedtableVisible.filter(
															(i) => i != e.id
														);
												} else {
													updatedtableVisible.push(e.id);
												}

												setTableVisible([...updatedtableVisible]);
											}}
										>
											View{" "}
											{
												(e.kind == EventType.Individual
													? allIndividuals
													: allTeams
												).filter((p) => p.events_ids_entered.includes(e.id))
													.length
											}{" "}
											participant
											{(e.kind == EventType.Individual
												? allIndividuals
												: allTeams
											).filter((p) => p.events_ids_entered.includes(e.id))
												.length == 1
												? ""
												: "s"}{" "}
											<ChevronDownIcon
												style={{
													transform: tableVisible.includes(e.id)
														? "rotate(180deg)"
														: ""
												}}
											/>
										</button>
										<table
											className={"table"}
											style={{
												width: "100%",
												display: tableVisible.includes(e.id) ? "" : "none"
											}}
										>
											<thead>
												<th>ID</th>
												<th>Name</th>
												<th>Type</th>
												<th>Actions</th>
											</thead>
											<tbody>
												{(e.kind == EventType.Individual
													? allIndividuals
													: allTeams
												)
													.filter((p) =>
														p.events_ids_entered.includes(e.id)
													)
													.map((p) => (
														<tr>
															<td>{p.id}</td>
															<td>{p.name}</td>
															<td>
																{e.kind == EventType.Individual
																	? "Individual"
																	: "Team"}
															</td>
															<td className={"small"}>
																<button
																	className={"btn danger small"}
																	style={{ marginLeft: "auto" }}
																	onClick={(el: any) => {
																		let int = setTimeout(() => {
																			el.target.removeAttribute(
																				"data-sure"
																			);
																			el.target.textContent =
																				"Remove";
																		}, 3000);

																		if (
																			el.target.hasAttribute(
																				"data-sure"
																			)
																		) {
																			store[
																				e.kind ==
																				EventType.Individual
																					? "individuals"
																					: "teams"
																			].call<TeamData>(
																				"edit_events",
																				{
																					[e.kind ==
																					EventType.Individual
																						? "individualId"
																						: "teamId"]:
																						p.id,
																					eventsIdsEntered:
																						p.events_ids_entered.filter(
																							(ev) =>
																								ev !==
																								e.id
																						)
																				}
																			);
																			clearTimeout(int);
																		} else {
																			el.target.setAttribute(
																				"data-sure",
																				""
																			);
																			el.target.textContent =
																				"Remove?";
																		}
																	}}
																>
																	Remove
																</button>
															</td>
														</tr>
													))}
											</tbody>
										</table>
									</td>
								</tr>
							</>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
