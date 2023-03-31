import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "../../components/icons/ChevronDown";
import { store } from "../../store";
import { EventData, TeamData } from "../../types";

// This screen is used to show you all the teams that have registered for the Students Tournament.
// Options for listing each player in the team, and for deleting the team are also available.
export const AdminTeams = (
	rest: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
	const navigate = useNavigate();

	// Stores state for all teams and events.
	const [allTeams, setAllTeams] = React.useState<TeamData[]>([]);
	const [allEvents, setAllEvents] = React.useState<EventData[]>([]);

	const [tableVisible, setTableVisible] = React.useState<any>([]);

	const getAllTeams = async () => {
		return store.teams.call<TeamData[]>("get_all_teams").then((res) => {
			setAllTeams(res);
		});
	};

	const getAllEvents = async () => {
		return store.events.call<EventData[]>("get_all_events").then((res) => {
			setAllEvents(res);
		});
	};

	React.useEffect(() => {
		const getAllPromises = () => Promise.all([getAllEvents(), getAllTeams()]);

		getAllPromises().then((_) => {
			store.teams.on("team_created", getAllTeams);
			store.teams.on("team_deleted", getAllTeams);
			store.teams.on("team_player_added", getAllTeams);
			store.teams.on("team_player_deleted", getAllTeams);
			store.events.on("event_created", getAllEvents);
			store.events.on("event_deleted", getAllEvents);
		});

		window.addEventListener("focus", getAllPromises);
		window.addEventListener("blur", getAllPromises);
	}, []);

	return (
		<div {...rest} className="admin-container center-container">
			<div className={"admin-main center-container"}>
				<h1>Teams</h1>
				<p>Create, modify or delete teams</p>
			</div>

			<div className={"admin-main center-container"}>
				<h3>All Teams</h3>

				<div className={"button-horiz"}>
					<div>
						<button
							className={"btn primary"}
							onClick={() => navigate("/intro/team/create")}
						>
							Create new team...
						</button>
					</div>
				</div>

				<table className={"table"}>
					<thead>
						<th>ID</th>
						<th>Name</th>
						<th>Events Entered</th>
						<th>Actions</th>
					</thead>
					<tbody>
						{allTeams.map((e, index) => (
							<>
								<tr key={`details-${index}`}>
									<td>{e.id}</td>
									<td>{e.name}</td>
									<td>
										{e.events_ids_entered
											.map((id) => allEvents.find((e) => e.id == id)?.name)
											.join(", ")}
									</td>
									<td className={"small button-horiz"}>
										<button
											className={"btn primary small"}
											onClick={(el: any) => {
												navigate("/intro/team/join", {
													state: { team_id: e.id }
												});
											}}
										>
											Add player
										</button>

										<button
											className={"btn primary small"}
											onClick={(el: any) => {
												navigate("/intro/team/edit_events", {
													state: {
														team_id: e.id,
														eventsIdsEntered: e.events_ids_entered
													}
												});
											}}
										>
											Edit events
										</button>

										<button
											className={"btn danger small"}
											onClick={(el: any) => {
												let int = setTimeout(() => {
													el.target.removeAttribute("data-sure");
													el.target.textContent = "Delete";
												}, 3000);

												if (el.target.hasAttribute("data-sure")) {
													store.teams.call("delete_team", {
														id: e.id
													});
													clearTimeout(int);
												} else {
													el.target.setAttribute("data-sure", "");
													el.target.textContent = "Delete?";
												}
											}}
										>
											Delete
										</button>
									</td>
								</tr>

								<tr className={"table"}>
									<td colSpan={5}>
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
											View {(e.players || []).length} player
											{(e.players || []).length == 1 ? "" : "s"}{" "}
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
												<th>Actions</th>
											</thead>
											<tbody>
												{(e.players || []).map((p) => (
													<tr>
														<td>{p.id}</td>
														<td>{p.name}</td>
														<td className={"small button-horiz"}>
															<button
																className={"btn danger small"}
																style={{ marginLeft: "auto" }}
																onClick={(el: any) => {
																	let int = setTimeout(() => {
																		el.target.removeAttribute(
																			"data-sure"
																		);
																		el.target.textContent =
																			"Delete";
																	}, 3000);

																	if (
																		el.target.hasAttribute(
																			"data-sure"
																		)
																	) {
																		store.teams.call(
																			"remove_player_from_team",
																			{
																				teamId: e.id,
																				playerId: p.id
																			}
																		);
																		clearTimeout(int);
																	} else {
																		el.target.setAttribute(
																			"data-sure",
																			""
																		);
																		el.target.textContent =
																			"Delete?";
																	}
																}}
															>
																Delete
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
