import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { EventsSelector } from "../../../components/EventsSelector";
import HeaderBar from "../../../components/HeaderBar";
import { store } from "../../../store";
import { EventType, TeamData } from "../../../types.d";

const IntroTeamsCreate = () => {
	const navigate = useNavigate();

	const schema = yup.object().shape({
		name: yup
			.string()
			.required("This field is required.")
			.min(2, "Team Name should be longer than 2 characters.")
	});

	const [allTeams, setAllTeams] = React.useState<TeamData[]>([]);

	const getAllTeams = async () => {
		return store.teams.call<TeamData[]>("get_all_teams").then((res) => {
			setAllTeams(res);
		});
	};

	React.useEffect(() => {
		const getAllPromises = () => Promise.all([getAllTeams()]);

		getAllPromises().then((_) => {
			store.teams.on("team_created", getAllTeams);
			store.teams.on("team_deleted", getAllTeams);
		});

		window.addEventListener("focus", getAllPromises);
		window.addEventListener("blur", getAllPromises);
	}, []);

	return (
		<div className={"teams-create-app"}>
			<HeaderBar goBack={() => navigate("/intro/team")} />

			<div className="center-container teams-create-initial">
				<div className={"intro-main intro-whoami teams-create-container"}>
					<div className={"teams-create"}>
						<h1>Create a new team</h1>

						<Formik
							validationSchema={schema}
							initialValues={
								{
									name: "",
									eventsIdsEntered: []
								} as {
									[key: string]: any;
									eventsIdsEntered: number[];
								}
							}
							onSubmit={async (values, helpers) => {
								store.teams
									.call<TeamData>("create_team", values)
									.then((t) =>
										navigate("/intro/team/join", { state: { team_id: t.id } })
									);
							}}
						>
							{({ values, isValid }) => (
								<Form className={"center-container"}>
									<div className="field">
										<label htmlFor="name">Team Name</label>
										<div className="field-container">
											<Field id="name" name="name" placeholder="" />
											<ErrorMessage name={"name"} component={"span"} />
										</div>
									</div>

									<div className={"field"}>
										<div className={"field-container"}>
											<FieldArray name="eventsIdsEntered">
												{({ remove, push }) => {
													return (
														<EventsSelector
															name={"eventsIdsEntered"}
															type={EventType.Team}
															userSelected={values.eventsIdsEntered}
															push={push}
															remove={remove}
														/>
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
												!isValid ||
												!values.eventsIdsEntered.length ||
												allTeams.length >= 4
											}
										>
											Create team
										</button>
										{allTeams.length >= 4 && (
											<span>
												Cannot create any more teams. Maximum of 4 teams
												reached.
											</span>
										)}
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</div>
		</div>
	);
};

export default IntroTeamsCreate;
