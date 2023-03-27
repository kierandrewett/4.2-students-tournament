import { ErrorMessage, Field, Form, Formik } from "formik";
import Modal from "react-modal";
import * as yup from "yup";
import HeaderBar from "../../components/HeaderBar";

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
		kind: yup.string().required("This field is required.").oneOf(["individual", "team"]),
		max_points: yup
			.number()
			.required("This field is required.")
			.min(1, "Max points should be more than 1 point.")
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
			<HeaderBar
				cancel={() => closeModal()}
				ok={() => closeModal()}
				title={"Create New Event..."}
			/>

			<main className={"modal-main"}>
				<Formik
					initialValues={{ name: "", kind: "individual", max_points: 0 }}
					validationSchema={schema}
					onSubmit={async (values) => {
						await new Promise((r) => setTimeout(r, 500));
						alert(JSON.stringify(values, null, 2));
					}}
				>
					<Form>
						<div className={"field-container"}>
							<label htmlFor="name">Event Name</label>
							<div className={"field"}>
								<Field name="name" type="text" placeholder="" autoFocus={true} />
								<ErrorMessage name="name" component={"span"} />
							</div>
						</div>

						<div className={"field-container"}>
							<div id="kind" className={"label"}>
								Event Kind
							</div>
							<div className={"field"} role="group" aria-labelledby="kind">
								<label>
									<Field type="radio" name="kind" value="individual" />
									Individual
								</label>
								<label>
									<Field type="radio" name="kind" value="team" />
									Team
								</label>
							</div>
						</div>

						<div className={"field-container"}>
							<label htmlFor="max_points">Event Max Points</label>
							<div className={"field"}>
								<Field name="max_points" type="num" placeholder="" />
								<ErrorMessage name="max_points" component={"span"} />
							</div>
						</div>
					</Form>
				</Formik>
			</main>
		</Modal>
	);
};
