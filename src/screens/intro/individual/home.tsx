import React from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../../../store";
import { IndividualData } from "../../../types";

const IntroIndividualHome = () => {
	const navigate = useNavigate();

	const [allIndividuals, setAllIndividuals] = React.useState<IndividualData[]>([]);

	const getAllIndividuals = async () => {
		return store.individuals.call<IndividualData[]>("get_all_individuals").then((res) => {
			setAllIndividuals(res);
		});
	};

	React.useEffect(() => {
		const getAllPromises = () => Promise.all([getAllIndividuals()]);

		getAllPromises().then((_) => {
			store.individuals.on("individual_created", getAllIndividuals);
		});

		window.addEventListener("focus", getAllPromises);
		window.addEventListener("blur", getAllPromises);
	}, []);

	return (
		<>
			<h1>Individuals</h1>
			<p>
				There {20 - allIndividuals.length == 1 ? "is only" : "are"}{" "}
				{20 - allIndividuals.length} space{20 - allIndividuals.length == 1 ? "" : "s"}{" "}
				remaining for individual participants in the Students Tournament.
			</p>

			<button
				className={"btn primary"}
				onClick={() => navigate("/intro/individual/signup")}
				disabled={!(20 - allIndividuals.length)}
			>
				Register as an individual
			</button>
		</>
	);
};

export default IntroIndividualHome;
