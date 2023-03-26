import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../../components/HeaderBar";
import Sidebar from "../../components/Sidebar";
import { AdminDashboard } from "./dashboard";
import { AdminEvents } from "./events";

const tabs = [
	{
		id: "dashboard",
		name: "Dashboard",
		render: () => <AdminDashboard />
	},
	{
		id: "events",
		name: "Events",
		render: () => <AdminEvents />
	}
];

const AdminMain = () => {
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = React.useState<string>(tabs[0].id);

	return (
		<>
			<Sidebar
				title={"Admin Mode"}
				goBack={() => navigate("/")}
				tabs={tabs}
				state={[currentTab, setCurrentTab]}
			>
				<HeaderBar />
			</Sidebar>
		</>
	);
};

export default AdminMain;
