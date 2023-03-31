import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { EventsSelector } from "../../../components/EventsSelector";
import HeaderBar from "../../../components/HeaderBar";
import { store } from "../../../store";
import { EventType, TeamData } from "../../../types.d";

// Screen used to edit a team's events
const IntroTeamsEditEvents = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [allTeams, setAllTeams] = React.useState<TeamData[]>([]);

	// Using yup for form validation
	//    team_id must be a number that is an integer and is required
	const schema = yup.object().shape({
		team_id: yup.number().integer().required("Team is required.")
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
			<HeaderBar title={""} goBack={() => window.history.back()} />

			<div className="center-container teams-create-initial">
				<div className={"intro-main intro-whoami teams-create-container"}>
					<div className={"teams-create"}>
						<Formik
							validationSchema={schema}
							initialValues={
								{
									team_id: (location.state && location.state.team_id) || "",
									eventsIdsEntered:
										(location.state && location.state.eventsIdsEntered) || []
								} as {
									[key: string]: any;
									team_id: string;
									eventsIdsEntered: number[];
								}
							}
							onSubmit={async (values, helpers) => {
								store.teams
									.call<TeamData>("edit_events", {
										teamId: values.team_id,
										eventsIdsEntered: values.eventsIdsEntered
									})
									.then((_) => navigate("/intro"));
							}}
						>
							{({ values, isValid, setFieldValue }) => {
								return (
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

										<div className={"field"}>
											<div className={"field-container"}>
												<FieldArray name="eventsIdsEntered">
													{({ remove, push }) => {
														return (
															location.state &&
															location.state.team_id && (
																<EventsSelector
																	name={"eventsIdsEntered"}
																	type={EventType.Team}
																	userSelected={
																		values.eventsIdsEntered
																	}
																	push={push}
																	remove={remove}
																/>
															)
														);
													}}
												</FieldArray>
											</div>
										</div>

										<div className={"field"} style={{ alignItems: "center" }}>
											<button
												type={"submit"}
												className={"btn primary"}
												disabled={
													!isValid || !values.eventsIdsEntered.length
												}
											>
												Edit team events
											</button>
										</div>
									</Form>
								);
							}}
						</Formik>
					</div>
				</div>
			</div>
		</div>
	);
};

export default IntroTeamsEditEvents;
