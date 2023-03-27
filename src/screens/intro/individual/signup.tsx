import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { EventsSelector } from "../../../components/EventsSelector";
import { store } from "../../../store";
import { EventType } from "../../../types.d";

const IntroIndividualSignup = () => {
	const navigate = useNavigate();

	const schema = yup.object().shape({
		_first_name: yup
			.string()
			.required("This field is required.")
			.min(2, "Forename should be longer than 2 characters."),
		_last_name: yup
			.string()
			.required("This field is required.")
			.min(2, "Surname should be longer than 2 characters.")
	});

	return (
		<div className={"individual-signup-container"}>
			<h1>Individuals Sign Up</h1>

			<Formik
				validationSchema={schema}
				initialValues={
					{
						_first_name: "",
						_last_name: "",
						eventsIdsEntered: []
					} as {
						[key: string]: any;
						eventsIdsEntered: number[];
					}
				}
				onSubmit={async (values, helpers) => {
					const data = {
						name: values._first_name + " " + values._last_name,
						eventsIdsEntered: values.eventsIdsEntered
					};

					store.individuals
						.call("create_individual", data)
						.then((_) => navigate("/intro"));

					alert(
						"Thank you for registering, you now may go join the tournament in the waiting area."
					);
				}}
			>
				{({ values, isValid }) => (
					<Form className={"center-container"}>
						<div className="field">
							<label htmlFor="_first_name">Full Name</label>
							<div className="field-row">
								<div className="field-container" style={{ width: "0%" }}>
									<Field
										id="_first_name"
										name="_first_name"
										placeholder="Forename"
									/>
									<ErrorMessage name={"_first_name"} component={"span"} />
								</div>
								<div className="field-container" style={{ width: "0%" }}>
									<Field
										id="_last_name"
										name="_last_name"
										placeholder="Surname"
									/>
									<ErrorMessage name={"_last_name"} component={"span"} />
								</div>
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

						<button
							type={"submit"}
							className={"btn primary"}
							disabled={!isValid || !values.eventsIdsEntered.length}
						>
							Register
						</button>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default IntroIndividualSignup;
