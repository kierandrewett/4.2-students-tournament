import React from "react";
import { CreateEventModal } from "../../modals/events/create";
import { store } from "../../store";
import { EventData, EventType } from "../../types.d";

export const AdminEvents = (
	rest: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
	const [selectedEvents, setSelectedEvents] = React.useState(new Map<number, boolean>());

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

				<button className={"btn danger"} disabled={selectedEvents.size == 0}>
					Delete selected
				</button>

				<table className={"table"}>
					<thead>
						<th></th>
						<th>ID</th>
						<th>Name</th>
						<th>Type</th>
						<th>Max Points</th>
					</thead>
					<tbody>
						{allEvents.map((e, index) => (
							<tr>
								<td>
									<input
										type="checkbox"
										onChange={(e) => {
											selectedEvents.set(index, e.target.checked);

											setSelectedEvents(selectedEvents);
										}}
									/>
								</td>
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
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
