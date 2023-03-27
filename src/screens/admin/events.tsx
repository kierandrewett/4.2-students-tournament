import React from "react";
import { CreateEventModal } from "../../modals/events/create";
import { store } from "../../store";
import { EventData, EventType } from "../../types.d";

export const AdminEvents = (
	rest: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
	const [allEvents, setAllEvents] = React.useState<EventData[]>([]);

	const [createEventModalOpen, setCreateEventModalOpen] = React.useState(false);

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
		<div {...rest} className="admin-container center-container">
			<div className={"admin-main center-container"}>
				<h1>Events</h1>
				<p>Create, modify or delete events</p>
			</div>

			<div className={"admin-main center-container"}>
				<h3>All Events</h3>

				<>
					<button className={"btn primary"} onClick={() => setCreateEventModalOpen(true)}>
						Create new event...
					</button>
					<CreateEventModal state={[createEventModalOpen, setCreateEventModalOpen]} />
				</>

				<table className={"table"}>
					<thead>
						<th>ID</th>
						<th>Name</th>
						<th>Type</th>
						<th>Max Points</th>
						<th>Actions</th>
					</thead>
					<tbody>
						{allEvents.map((e, index) => (
							<tr>
								<td>{e.id}</td>
								<td>{e.name}</td>
								<td>
									{(() => {
										switch (e.kind) {
											case EventType.Individual:
												return "Individual";
											case EventType.Team:
												return "Team";
										}
									})()}
								</td>
								<td>{e.max_points}</td>
								<td className={"small"}>
									<button
										className={"btn danger small"}
										onClick={() => {
											store.events.call("delete_event", { id: e.id });
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
