import { useNavigate } from "react-router-dom";
import HeaderBar from "../../components/HeaderBar";
import { PeopleIcon } from "../../components/icons/People";
import { PersonIcon } from "../../components/icons/Person";

const IntroWhoAmI = () => {
	const navigate = useNavigate();

	return (
		<>
			<HeaderBar goBack={() => navigate("/")} />

			<div className="center-container intro-container">
				<div className={"intro-main intro-whoami center-container"}>
					<h1>Who are you entering as?</h1>
					<p>
						You can choose to enter the tournament as an individual or as part of a
						team.
					</p>

					<div className={"button-horiz"}>
						<button
							className={"btn secondary"}
							onClick={() => navigate("/intro/individual")}
						>
							<PersonIcon />I am entering as an individual
						</button>
						<button className={"btn secondary"} onClick={() => navigate("/intro/team")}>
							<PeopleIcon />I am entering as part of a team
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default IntroWhoAmI;
