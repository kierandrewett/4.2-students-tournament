import React from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../../store";
import { EventData } from "../../types";

const Intro = () => {
	const navigate = useNavigate();

	const [ready, setReady] = React.useState(false);
	const [allEvents, setAllEvents] = React.useState<EventData[]>([]);

	const getAllEvents = async () => {
		return store.events.call<EventData[]>("get_all_events").then((res) => {
			setAllEvents(res);
		});
	};

	React.useEffect(() => {
		const getAllPromises = () => Promise.all([getAllEvents()]);

		getAllPromises().then((_) => {
			setReady(true);

			store.events.on("event_created", getAllEvents);
		});

		window.addEventListener("focus", getAllPromises);
		window.addEventListener("blur", getAllPromises);
	}, []);

	return (
		<>
			<div className="center-container intro-container">
				<div className={"intro-main center-container"}>
					<h1>Welcome to the Students Tournament!</h1>
					<p>
						When you are ready to start the entering process, press the Start button
						below.
					</p>

					<button className={"btn primary"} disabled={!ready || !allEvents.length}>
						Start
					</button>
				</div>

				<div className={"admin-info-container"}>
					<button
						className={"btn secondary"}
						disabled={!ready}
						onClick={() => navigate("/admin")}
					>
						Admin Mode
					</button>
					{ready && !allEvents.length ? (
						<small>Some information is missing! Complete setup in admin mode.</small>
					) : null}
				</div>
			</div>
		</>
	);
};

export default Intro;
