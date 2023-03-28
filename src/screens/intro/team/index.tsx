import { useNavigate } from "react-router-dom";
import HeaderBar from "../../../components/HeaderBar";
import { AddIcon } from "../../../components/icons/Add";
import { AddPersonIcon } from "../../../components/icons/AddPerson";

const IntroTeam = () => {
	const navigate = useNavigate();

	return (
		<>
			<HeaderBar goBack={() => navigate("/intro/whoami")} />

			<div className="center-container intro-container">
				<div className={"intro-main intro-whoami center-container"}>
					<h1>Does your team exist or are you joining a team?</h1>
					<p>
						If your team doesn't currently exist, you will need to create a new team.
						Otherwise, you can join an existing team.
					</p>

					<div className={"button-horiz"}>
						<button
							className={"btn primary"}
							onClick={() => navigate("/intro/team/join")}
						>
							<AddPersonIcon />
							Join an existing team...
						</button>
						<button
							className={"btn secondary"}
							onClick={() => navigate("/intro/team/create")}
						>
							<AddIcon />
							Create a new team...
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default IntroTeam;
