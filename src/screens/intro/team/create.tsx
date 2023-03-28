import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
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

									<button
										type={"submit"}
										className={"btn primary"}
										disabled={!isValid || !values.eventsIdsEntered.length}
									>
										Create team
									</button>
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
