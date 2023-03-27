import React from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../../store";
import { EventData, IndividualData } from "../../types.d";

export const AdminIndividuals = (
	rest: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
	const navigate = useNavigate();

	const [allIndividuals, setAllIndividuals] = React.useState<IndividualData[]>([]);
	const [allEvents, setAllEvents] = React.useState<EventData[]>([]);

	const getAllIndividuals = async () => {
		return store.individuals.call<IndividualData[]>("get_all_individuals").then((res) => {
			setAllIndividuals(res);
		});
	};

	const getAllEvents = async () => {
		return store.events.call<EventData[]>("get_all_events").then((res) => {
			setAllEvents(res);
		});
	};

	React.useEffect(() => {
		const getAllPromises = () => Promise.all([getAllEvents(), getAllIndividuals()]);

		getAllPromises().then((_) => {
			store.individuals.on("individual_created", getAllIndividuals);
			store.individuals.on("individual_deleted", getAllIndividuals);
			store.events.on("event_created", getAllEvents);
			store.events.on("event_deleted", getAllEvents);
		});

		window.addEventListener("focus", getAllPromises);
		window.addEventListener("blur", getAllPromises);
	}, []);

	return (
		<div {...rest} className="admin-container center-container">
			<div className={"admin-main center-container"}>
				<h1>Individuals</h1>
				<p>Create, modify or delete individuals</p>
			</div>

			<div className={"admin-main center-container"}>
				<h3>All Individuals</h3>

				<div className={"button-horiz"}>
					<div>
						<button
							className={"btn primary"}
							onClick={() => navigate("/intro/individual/signup")}
						>
							Create new individual...
						</button>
					</div>
				</div>

				<table className={"table"}>
					<thead>
						<th>ID</th>
						<th>Name</th>
						<th>Events Entered</th>
						<th>Actions</th>
					</thead>
					<tbody>
						{allIndividuals.map((e, index) => (
							<tr key={index}>
								<td>{e.id}</td>
								<td>{e.name}</td>
								<td>
									{e.events_ids_entered
										.map((id) => allEvents.find((e) => e.id == id)?.name)
										.join(", ")}
								</td>
								<td className={"small"}>
									<button
										className={"btn danger small"}
										onClick={(el: any) => {
											let int = setTimeout(() => {
												el.target.removeAttribute("data-sure");
												el.target.textContent = "Delete";
											}, 3000);

											if (el.target.hasAttribute("data-sure")) {
												store.individuals.call("delete_individual", {
													id: e.id
												});
												clearTimeout(int);
											} else {
												el.target.setAttribute("data-sure", "");
												el.target.textContent = "Delete?";
											}
										}}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
