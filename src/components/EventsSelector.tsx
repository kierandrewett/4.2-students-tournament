import { ArrayHelpers, ErrorMessage } from "formik";
import React from "react";
import { store } from "../store";
import { EventData, EventType } from "../types.d";
import { BackIcon } from "./icons/Back";

export const EventsSelector = ({
	name,
	userSelected,
	type,
	push,
	remove
}: {
	name: string;
	userSelected: number[];
	type: EventType;
	push: ArrayHelpers["push"];
	remove: ArrayHelpers["remove"];
}) => {
	const [rightSideSelected, setRightSideSelected] = React.useState<number | null>();
	const [leftSideSelected, setLeftSideSelected] = React.useState<number | null>();

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

	const items = allEvents.filter((e) => !userSelected.includes(e.id) && e.kind == type);

	return (
		<div>
			<div className={"select-horiz"} style={{ height: "250px" }}>
				<div className={"field"}>
					<label>All Events</label>

					<div
						className="select multi"
						style={{
							height: "100%"
						}}
					>
						{items.map((event, index) => (
							<div
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
							</div>
						))}
					</div>
				</div>

				<div className="center-container select-multi-buttons">
					<button
						className={"btn is-icon"}
						type={"button"}
						disabled={rightSideSelected == null || !userSelected.length}
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
								.filter((e) => !userSelected.includes(e.id))
								.find((e) => e.id == leftSideSelected)
						}
						onClick={() => {
							if (userSelected.includes(leftSideSelected as number)) return;

							const currItemIndex = items.findIndex((e) => e.id == leftSideSelected);

							push(leftSideSelected as number);
							setLeftSideSelected(
								items[currItemIndex + 1]
									? items[currItemIndex + 1].id
									: items[currItemIndex - 1]
									? items[currItemIndex - 1].id
									: -1
							);
						}}
					>
						<BackIcon
							style={{
								transform: "rotate(180deg)"
							}}
						/>
					</button>
				</div>

				<div className={"field"}>
					<label>{type == EventType.Individual ? "Your" : "Team's"} Events</label>

					<div
						className="select multi"
						style={{
							height: "100%"
						}}
					>
						{userSelected.length > 0 &&
							userSelected.map((eventId, index) => (
								<div
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
									{allEvents.find((e) => e.id == eventId)?.name}
								</div>
							))}
					</div>
				</div>
			</div>

			<ErrorMessage name={name} component={"span"} />
		</div>
	);
};
