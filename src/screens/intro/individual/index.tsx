import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderBar from "../../../components/HeaderBar";
import Sidebar, { Tab } from "../../../components/Sidebar";
import { store } from "../../../store";
import { IndividualData } from "../../../types.d";

// Wraps all the other individual screens in a sidebar.
const IntroIndividual = () => {
	const location = useLocation();

	const [tabs, setTabs] = React.useState<Tab[]>([]);

	const getAllIndividuals = async () => {
		return store.individuals.call<IndividualData[]>("get_all_individuals").then((res) => {
			setTabs(
				res.map((i) => ({
					id: i.id.toString(),
					name: i.name,
					disabled: true,
					render: () => <></>
				}))
			);
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
		<Sidebar
			title={() => `Individuals (${tabs.length}/20)`}
			goBack={() => window.history.back()}
			tabs={tabs}
			state={["", (v: any) => {}]}
		>
			<HeaderBar />

			<div className="center-container intro-container">
				<div className={"intro-main intro-whoami center-container"}>
					<Outlet />
				</div>
			</div>
		</Sidebar>
	);
};

export default IntroIndividual;
