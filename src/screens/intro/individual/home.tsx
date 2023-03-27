import { useNavigate } from "react-router-dom";

const IntroIndividualHome = () => {
	const navigate = useNavigate();

	return (
		<>
			<h1>Individuals</h1>
			<p>There are up to 20 spaces for individual participants in the Students Tournament.</p>

			<button className={"btn primary"} onClick={() => navigate("/intro/individual/signup")}>
				Register as an individual
			</button>
		</>
	);
};

export default IntroIndividualHome;
