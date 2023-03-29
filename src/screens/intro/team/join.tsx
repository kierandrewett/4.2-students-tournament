import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import HeaderBar from "../../../components/HeaderBar";
import { store } from "../../../store";
import { TeamData } from "../../../types";

const IntroTeamsJoin = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [allTeams, setAllTeams] = React.useState<TeamData[]>([]);

	const schema = yup.object().shape({
		team_id: yup.number().integer().required("Team is required."),
		_first_name: yup
			.string()
			.required("This field is required.")
			.min(2, "Forename should be longer than 2 characters."),
		_last_name: yup
			.string()
			.required("This field is required.")
			.min(2, "Surname should be longer than 2 characters.")
	});

	const getAllTeams = async () => {
		return store.teams.call<TeamData[]>("get_all_teams").then((res) => {
			setAllTeams(res);
		});
	};

	React.useEffect(() => {
		const getAllPromises = () => Promise.all([getAllTeams()]);

		getAllPromises().then((_) => {
			store.teams.on("team_created", getAllTeams);
		});

		window.addEventListener("focus", getAllPromises);
		window.addEventListener("blur", getAllPromises);
	}, []);

	return (
		<div className={"teams-create-app"}>
			<HeaderBar
				title={""}
				goBack={
					location.state && location.state.team_id
						? () => window.history.back()
						: () => navigate("/intro/team")
				}
			/>

			<div className="center-container teams-create-initial">
				<div className={"intro-main intro-whoami teams-create-container"}>
					<div className={"teams-create"}>
						<Formik
							validationSchema={schema}
							initialValues={{
								team_id: (location.state && location.state.team_id) || "",
								_first_name: "",
								_last_name: ""
							}}
							validate={(values) => {
								const errors: any = {};

								if (values.team_id) {
									const team = allTeams.find((t) => t.id == values.team_id);

									if (team?.players && team.players.length >= 5) {
										errors.team_id =
											"Cannot join team. Team has reached maximum 5 players.";
									}
								}

								return errors;
							}}
							onSubmit={async (values, helpers) => {
								const playerName = `${values._first_name} ${values._last_name}`;

								store.teams
									.call("add_player_to_team", {
										id: +values.team_id,
										player: {
											name: playerName
										}
									})
									.then((_) => {
										navigate("/intro");
									})
									.catch(console.log);

								const teamName = allTeams.find(
									(t) => t.id == +values.team_id
								)?.name;

								alert(
									`Thank you, ${playerName}. You have been added to '${teamName}', you now may go join the tournament in the waiting area.`
								);
							}}
						>
							{({ values, isValid, handleChange }) => (
								<>
									<h1>
										{location.state && location.state.team_id
											? `Join '${
													allTeams.find((t) => t.id == values.team_id)
														?.name
											  }'`
											: "Join a team"}
									</h1>

									<Form className={"center-container"}>
										<div className="field">
											<label htmlFor="team_id">Team Name</label>
											<div className="field-container">
												<div className={"select-container"}>
													<Field
														name="team_id"
														as={"select"}
														disabled={
															location.state && location.state.team_id
														}
													>
														<option value={""} disabled></option>

														{allTeams.map((t) => (
															<option key={t.id} value={t.id}>
																{t.name}
																{` (${(t.players || []).length}/5)`}
															</option>
														))}
													</Field>
												</div>
												<ErrorMessage name={"team_id"} component={"span"} />
											</div>
										</div>

										<h2>Player information</h2>

										<div className="field">
											<label htmlFor="_first_name">Full Name</label>
											<div className="field-row">
												<div
													className="field-container"
													style={{ width: "0%" }}
												>
													<Field
														id="_first_name"
														name="_first_name"
														placeholder="Forename"
													/>
													<ErrorMessage
														name={"_first_name"}
														component={"span"}
													/>
												</div>
												<div
													className="field-container"
													style={{ width: "0%" }}
												>
													<Field
														id="_last_name"
														name="_last_name"
														placeholder="Surname"
													/>
													<ErrorMessage
														name={"_last_name"}
														component={"span"}
													/>
												</div>
											</div>
										</div>

										<button
											type={"submit"}
											className={"btn primary"}
											disabled={!isValid || values.team_id == ""}
										>
											Join team
										</button>
									</Form>
								</>
							)}
						</Formik>
					</div>
				</div>
			</div>
		</div>
	);
};

export default IntroTeamsJoin;
