import { invoke } from "@tauri-apps/api";
import React from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../../store";
import { EventData, EventType, IndividualData, TeamData } from "../../types.d";

// Main dashboard for the admin mode
// Lists all the requirements for entering finalise mode.
export const AdminDashboard = (
	rest: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
	const navigate = useNavigate();

	// Stores state for all the teams, individuals and events.
	const [allTeams, setAllTeams] = React.useState<TeamData[]>([]);
	const [allIndividuals, setAllIndividuals] = React.useState<IndividualData[]>([]);
	const [allEvents, setAllEvents] = React.useState<EventData[]>([]);

	const getAllEvents = async () => {
		return store.events.call<EventData[]>("get_all_events").then((res) => {
			setAllEvents(res);
		});
	};

	const getAllTeams = async () => {
		return store.teams.call<TeamData[]>("get_all_teams").then((res) => {
			setAllTeams(res);
		});
	};

	const getAllIndividuals = async () => {
		return store.individuals.call<IndividualData[]>("get_all_individuals").then((res) => {
			setAllIndividuals(res);
		});
	};

	React.useEffect(() => {
		const getAllPromises = () =>
			Promise.all([getAllEvents(), getAllIndividuals(), getAllTeams()]);

		getAllPromises().then((_) => {
			store.events.on("event_created", getAllEvents);
			store.events.on("event_deleted", getAllEvents);
			store.individuals.on("individual_created", getAllIndividuals);
			store.individuals.on("individual_deleted", getAllIndividuals);
			store.teams.on("team_created", getAllTeams);
			store.teams.on("team_deleted", getAllTeams);
			store.teams.on("team_player_added", getAllTeams);
			store.teams.on("team_player_deleted", getAllTeams);
		});

		window.addEventListener("focus", getAllPromises);
		window.addEventListener("blur", getAllPromises);
	}, []);

	// Gets all the events that have a max_teams value set, and checks if the number of teams participating is less than the max_teams value.
	const getAllEventsWithMinimalNumbers = () => {
		const errors = [];

		for (const event of allEvents) {
			if (event.max_teams && Number.isInteger(event.max_teams)) {
				if (event.kind == EventType.Team) {
					const teamsParticipating = allTeams.filter((t) =>
						t.events_ids_entered.includes(event.id)
					);

					if (teamsParticipating.length < event.max_teams) {
						errors.push({
							...event,
							teamsParticipating
						});
					}
				}
			}
		}

		return errors;
	};

	// Checks if the tournament is ready to be finalised.
	const shouldShowRankingInfo = () => {
		const totalTeamPlayers = (allTeams || [])
			.map(
				(prev: any, curr: any) => (curr.players || []).length + (prev.players || []).length
			)
			.reduce((a, b) => a + b, 0);
		const totalIndividuals = (allIndividuals || []).length;

		return [totalTeamPlayers, totalIndividuals];
	};

	// Finalises the tournament and locks the data store.
	const finaliseTournament = () => {
		invoke("lock_data").then((_) => {
			navigate("/admin/finalise", { state: { key: "lock" } });
		});
	};

	return (
		<div {...rest} className="center-container admin-container">
			<div className={"admin-main center-container"}>
				<h1>Dashboard</h1>
				<p>Internal tournament settings</p>

				<div className={"admin-main center-container"}>
					<h3>Ranking and scoring</h3>
					<p>
						Clicking <b>Finalise tournament</b> will end the tournament and allow you to
						input the rankings of each team or player in their respective events.
					</p>
					{shouldShowRankingInfo()[0] < 20 ||
					shouldShowRankingInfo()[1] < 5 ||
					getAllEventsWithMinimalNumbers().length ? (
						<>
							<p>
								This section will be available once all{" "}
								<b>4 teams have 5 members</b> and more than{" "}
								<b>5 individuals have registered</b>.
							</p>
							<h4>Requirements:</h4>
							{shouldShowRankingInfo()[0] < 20 ? (
								<>
									<p>
										<strong style={{ color: "var(--warning)" }}>
											4 teams with 5 members need to be registered.
										</strong>
									</p>
								</>
							) : (
								<></>
							)}
							{shouldShowRankingInfo()[0] < 20 && shouldShowRankingInfo()[0] >= 5 && (
								<>
									<p>
										<strong style={{ color: "var(--warning)" }}>
											The following team positions need to be filled:
										</strong>
									</p>
									<ul>
										{allTeams
											.concat([...Array(5)])
											.splice(allTeams.length)
											.map((t, index) => (
												<>
													<li
														key={t ? t.id : index}
														style={{
															color:
																!t ||
																(t ? t.players || [] : [])
																	.length !== 5
																	? "var(--warning)"
																	: "",
															fontWeight:
																!t ||
																(t ? t.players || [] : [])
																	.length !== 5
																	? 700
																	: ""
														}}
													>
														{t
															? `${t.name} (${
																	(t.players || []).length
															  }/5)`
															: `Team`}
													</li>
													<ul
														key={(t ? t.id : index) + `-list`}
														style={{ marginInlineStart: "2rem" }}
													>
														{[
															...(t ? t.players || [] : []),
															...new Array(
																5 -
																	(t ? t.players || [] : [])
																		.length
															)
														].map((p) => {
															return (
																!p && (
																	<li>
																		<b>Empty place</b>
																	</li>
																)
															);
														})}
													</ul>
												</>
											))}
									</ul>
								</>
							)}
							{shouldShowRankingInfo()[1] < 5 ? (
								<>
									<p>
										<strong style={{ color: "var(--warning)" }}>
											{5 - shouldShowRankingInfo()[1]} more individuals need
											to register.
										</strong>
									</p>
								</>
							) : (
								<></>
							)}
							{getAllEventsWithMinimalNumbers().length ? (
								<>
									<p>
										<strong style={{ color: "var(--warning)" }}>
											Some events do not have the required number of
											teams/participants taking place.
										</strong>
									</p>

									<ul>
										{getAllEventsWithMinimalNumbers().map((e: any) => (
											<li key={e.id}>
												<p>
													<strong style={{ color: "var(--warning)" }}>
														{e.name}: Has only{" "}
														{e.teamsParticipating.length} teams
														participating, needs {e.max_teams}
													</strong>
												</p>
											</li>
										))}
									</ul>
								</>
							) : (
								<></>
							)}
						</>
					) : (
						<></>
					)}

					<div className={"button-horiz"}>
						<div>
							<button
								className={"btn primary"}
								disabled={
									!!(
										shouldShowRankingInfo()[0] < 20 ||
										shouldShowRankingInfo()[1] < 5 ||
										getAllEventsWithMinimalNumbers().length
									)
								}
								onClick={(el: any) => {
									let int = setTimeout(() => {
										el.target.removeAttribute("data-sure");
										el.target.classList.replace("danger", "primary");
										el.target.textContent = "Finalise tournament";
									}, 1000);

									if (el.target.hasAttribute("data-sure")) {
										clearTimeout(int);
										el.target.textContent = "Finalising...";
										el.target.classList.replace("danger", "primary");
										el.target.disabled = "true";
										finaliseTournament();
									} else {
										el.target.setAttribute("data-sure", "");
										el.target.classList.replace("primary", "danger");
										el.target.textContent = "Are you sure?";
									}
								}}
							>
								Finalise tournament
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
