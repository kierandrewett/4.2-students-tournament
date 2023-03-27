import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { BackIcon } from "../../../components/icons/Back";
import { store } from "../../../store";
import { EventData } from "../../../types.d";

const IntroIndividualSignup = () => {
	const navigate = useNavigate();

	const [rightSideSelected, setRightSideSelected] = React.useState<number | null>();
	const [leftSideSelected, setLeftSideSelected] = React.useState<number | null>();

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

	const [allEvents, setAllEvents] = React.useState<EventData[]>([]);

	const getAllEvents = async () => {
		return store.events.call<EventData[]>("get_all_events").then((res) => {
			setAllEvents(res);
		});
	};

	React.useEffect(() => {
		const getAllPromises = () => Promise.all([getAllEvents()]);

		getAllPromises().then((_) => {
			store.events.on("event_created", getAllEvents);
			store.events.on("event_deleted", getAllEvents);
		});

		window.addEventListener("focus", getAllPromises);
		window.addEventListener("blur", getAllPromises);
	}, []);

	return (
		<div className={"individual-signup-container"}>
			<h1>Individuals Sign Up</h1>

			<Formik
				validationSchema={schema}
				initialValues={
					{
						_first_name: "",
						_last_name: "",
						events_ids_entered: []
					} as {
						[key: string]: any;
						events_ids_entered: number[];
					}
				}
				onSubmit={async (values, helpers) => {
					const data = {
						name: values._first_name + " " + values._last_name,
						events_ids_entered: values.events_ids_entered
					};

					store.individuals
						.call("create_individual", data)
						.then((_) => navigate("/intro/individual/"));

					alert(JSON.stringify(data, null, 4));
				}}
			>
				{({ values, isValid }) => (
					<Form>
						<div className="field">
							<label htmlFor="_first_name">Full Name</label>
							<div className="field-row">
								<div className="field-container">
									<Field
										id="_first_name"
										name="_first_name"
										placeholder="Forename"
									/>
									<ErrorMessage name={"_first_name"} component={"span"} />
								</div>
								<div className="field-container">
									<Field
										id="_last_name"
										name="_last_name"
										placeholder="Surname"
									/>
									<ErrorMessage name={"_last_name"} component={"span"} />
								</div>
							</div>
						</div>

						<FieldArray name="events_ids_entered">
							{({ insert, remove, push }) => (
								<div>
									<div className={"select-horiz"} style={{ height: "250px" }}>
										<div className="select multi">
											{allEvents
												.filter(
													(e) => !values.events_ids_entered.includes(e.id)
												)
												.map((event, index) => (
													<span
														key={index}
														data-value={event.id}
														data-selected={leftSideSelected == event.id}
														onMouseDown={() => {
															setLeftSideSelected(event.id);
															setRightSideSelected(null);
														}}
														onMouseUp={() => {
															setLeftSideSelected(event.id);
															setRightSideSelected(null);
														}}
													>
														{event.name}
													</span>
												))}
										</div>

										<div className="center-container select-multi-buttons">
											<button
												className={"btn is-icon"}
												type={"button"}
												disabled={
													rightSideSelected == null ||
													!values.events_ids_entered.length
												}
												onClick={() => {
													remove(rightSideSelected as number);
													setRightSideSelected(
														(rightSideSelected as number) - 1 < 0
															? rightSideSelected
															: (rightSideSelected as number) - 1
													);
												}}
											>
												<BackIcon />
											</button>
											<button
												className={"btn is-icon"}
												type={"button"}
												disabled={
													leftSideSelected == null ||
													!allEvents
														.filter(
															(e) =>
																!values.events_ids_entered.includes(
																	e.id
																)
														)
														.find((e) => e.id == leftSideSelected)
												}
												onClick={() => {
													if (
														values.events_ids_entered.includes(
															leftSideSelected as number
														)
													)
														return;

													const items = allEvents.filter(
														(e) =>
															!values.events_ids_entered.includes(
																e.id
															)
													);
													const currItemIndex = items.findIndex(
														(e) => e.id == leftSideSelected
													);

													push(leftSideSelected as number);
													setLeftSideSelected(
														items[currItemIndex + 1]
															? items[currItemIndex + 1].id
															: items[currItemIndex - 1].id
													);
												}}
											>
												<BackIcon style={{ transform: "rotate(180deg)" }} />
											</button>
										</div>

										<div className="select multi">
											{values.events_ids_entered.length > 0 &&
												values.events_ids_entered.map((eventId, index) => (
													<span
														key={index}
														data-value={eventId}
														data-selected={rightSideSelected == index}
														onMouseDown={() => {
															setRightSideSelected(index);
															setLeftSideSelected(null);
														}}
														onMouseUp={() => {
															setRightSideSelected(index);
															setLeftSideSelected(null);
														}}
													>
														{
															allEvents.find((e) => e.id == eventId)
																?.name
														}
													</span>
												))}
										</div>
									</div>
								</div>
							)}
						</FieldArray>

						<button type={"submit"} className={"btn primary"} disabled={!isValid}>
							Register
						</button>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default IntroIndividualSignup;
