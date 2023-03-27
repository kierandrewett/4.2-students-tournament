import { ErrorMessage, Field, Form, Formik } from "formik";
import Modal from "react-modal";
import * as yup from "yup";
import HeaderBar from "../../components/HeaderBar";
import { store } from "../../store";
import { EventType } from "../../types.d";

export const CreateEventModal = ({
	state
}: {
	state: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) => {
	const [open, setOpen] = state;

	function closeModal() {
		setOpen(false);
	}

	const schema = yup.object().shape({
		name: yup
			.string()
			.required("This field is required.")
			.min(4, "Event name should be longer than 4 characters."),
		kind: yup.string().required("This field is required.").oneOf(["Individual", "Team"]),
		maxPoints: yup
			.number()
			.typeError("Max points should be a number.")
			.positive("Max points should be a positive number.")
			.integer("Max points should be a positive number.")
			.required("This field is required.")
			.min(1, "Max points should be more than 1 point."),
		maxTeams: yup
			.number()
			.nullable()
			.optional()
			.typeError("Max teams should be a number.")
			.positive("Max teams should be a positive number.")
			.integer("Max teams should be a positive number.")
			.min(1, "Max teams should be more than 2.")
	});

	return (
		<Modal
			className={"modal-content"}
			overlayClassName={"modal-overlay"}
			isOpen={open}
			onRequestClose={closeModal}
			style={{ content: { minWidth: 550, minHeight: 300 } }}
			contentLabel={"Create New Event..."}
		>
			<Formik
				validationSchema={schema}
				initialValues={{
					name: "",
					kind: "Individual",
					maxPoints: "",
					maxTeams: null
				}}
				onSubmit={async (values, helpers) => {
					if (values.kind !== EventType.Team) {
						helpers.setFieldValue("maxTeams", null);
					}

					store.events
						.call("create_event", values)
						.then((_) => closeModal())
						.catch((e) => console.error(e));
				}}
			>
				{({ values, isValid }) => (
					<Form>
						<HeaderBar
							cancel={() => closeModal()}
							cancelProps={{ type: "button" }}
							ok={() => {}}
							okProps={{ type: "submit", disabled: !isValid }}
							title={"Create New Event..."}
						/>

						<main className={"modal-main"}>
							<div className="field">
								<label htmlFor="name">Event Name</label>
								<div className="field-container">
									<Field id="name" name="name" placeholder="" />
									<ErrorMessage name={"name"} component={"span"} />
								</div>
							</div>

							<div className={"field"}>
								<label id="kind">Event Type</label>
								<div
									className={"field-container"}
									role="group"
									aria-labelledby="kind"
								>
									<label>
										<Field type="radio" name="kind" value="Individual" />
										Individual
									</label>
									<label>
										<Field type="radio" name="kind" value="Team" />
										Team
									</label>
									<ErrorMessage name={"kind"} component={"span"} />
								</div>
							</div>

							<div className={"field"}>
								<label htmlFor="maxPoints">Max Points</label>
								<div className={"field-container"}>
									<Field
										id="maxPoints"
										name="maxPoints"
										placeholder=""
										type={"number"}
									/>
									<ErrorMessage name={"maxPoints"} component={"span"} />
								</div>
							</div>

							<div
								className={"field"}
								style={{ display: values.kind == EventType.Team ? "" : "none" }}
							>
								<label htmlFor="maxTeams">Max Teams</label>
								<div className={"field-container"}>
									<Field
										id="maxTeams"
										name="maxTeams"
										placeholder={"Enter blank for unlimited teams"}
										type={"number"}
									/>
									<ErrorMessage name={"maxTeams"} component={"span"} />
								</div>
							</div>
						</main>
					</Form>
				)}
			</Formik>
		</Modal>
	);
};
