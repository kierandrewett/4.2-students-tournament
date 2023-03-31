import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { EventsSelector } from "../../../components/EventsSelector";
import { store } from "../../../store";
import { EventType, IndividualData, TeamData } from "../../../types.d";

// This screen is used to edit the events of an individual.
const IntroIndividualEditEvents = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [allIndividuals, setAllIndividuals] = React.useState<IndividualData[]>([]);

	// Using Yup to validate the form.
	//     individual_id - Individual is a required integer.
	const schema = yup.object().shape({
		individual_id: yup.number().integer().required("Individual is required.")
	});

	const getAllIndividuals = async () => {
		return store.individuals.call<IndividualData[]>("get_all_individuals").then((res) => {
			setAllIndividuals(res);
		});
	};

	React.useEffect(() => {
		const getAllPromises = () => Promise.all([getAllIndividuals()]);

		getAllPromises().then((_) => {
			store.individuals.on("individual_created", getAllIndividuals);
		});

		window.addEventListener("focus", getAllPromises);
		window.addEventListener("blur", getAllPromises);
	}, []);

	return (
		<div className={"individual-signup-container"}>
			<h1>Edit Individual's Events</h1>

			<Formik
				validationSchema={schema}
				initialValues={
					{
						individual_id: (location.state && location.state.individual_id) || "",
						eventsIdsEntered: (location.state && location.state.eventsIdsEntered) || []
					} as {
						[key: string]: any;
						individual_id: string;
						eventsIdsEntered: number[];
					}
				}
				onSubmit={async (values, helpers) => {
					store.individuals
						.call<TeamData>("edit_events", {
							individualId: +values.individual_id,
							eventsIdsEntered: values.eventsIdsEntered
						})
						.then((_) => navigate("/intro"));
				}}
			>
				{({ values, isValid, setFieldValue, handleChange }) => {
					return (
						<Form className={"center-container"}>
							<div className="field">
								<label htmlFor="individual_id">Individual's Name</label>
								<div className="field-container">
									<div className={"select-container"}>
										<Field
											name="individual_id"
											as={"select"}
											disabled={
												location.state && location.state.individual_id
											}
											onChange={(e: any) => {
												const id = e.target.value;

												handleChange(e);
											}}
										>
											<option value={""} disabled></option>

											{allIndividuals.map((t) => (
												<option key={t.id} value={t.id}>
													{t.name}
												</option>
											))}
										</Field>
									</div>
									<ErrorMessage name={"individual_id"} component={"span"} />
								</div>
							</div>

							<div className={"field"}>
								<div className={"field-container"}>
									<FieldArray name="eventsIdsEntered">
										{({ remove, push }) => {
											return (
												<EventsSelector
													name={"eventsIdsEntered"}
													type={EventType.Individual}
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
									disabled={!isValid || !values.eventsIdsEntered.length}
								>
									Edit individual's events
								</button>
							</div>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
};

export default IntroIndividualEditEvents;
