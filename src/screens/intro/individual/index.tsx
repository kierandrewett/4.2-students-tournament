import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderBar from "../../../components/HeaderBar";
import Sidebar from "../../../components/Sidebar";

const IntroIndividual = () => {
	const location = useLocation();

	const [tabs, setTabs] = React.useState([
		{
			id: "0",
			name: "Kieran",
			disabled: true,
			render: () => <></>
		},
		{
			id: "1",
			name: "Jack",
			disabled: true,
			render: () => <></>
		},
		{
			id: "2",
			name: "Tom",
			disabled: true,
			render: () => <></>
		},
		{
			id: "3",
			name: "Dan",
			disabled: true,
			render: () => <></>
		},
		{
			id: "4",
			name: "Jamie",
			disabled: true,
			render: () => <></>
		}
	]);

	return (
		<Sidebar
			title={() => `Individuals (${tabs.length + 1}/20)`}
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
