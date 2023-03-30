import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Main from "../screens";
import AdminMain from "../screens/admin";
import { AdminFinalise } from "../screens/admin/finalise";
import { AdminFinaliseEnd } from "../screens/admin/finalise/end";
import Intro from "../screens/intro";
import IntroIndividual from "../screens/intro/individual";
import IntroIndividualEditEvents from "../screens/intro/individual/edit_events";
import IntroIndividualHome from "../screens/intro/individual/home";
import IntroIndividualSignup from "../screens/intro/individual/signup";
import IntroTeam from "../screens/intro/team";
import IntroTeamsCreate from "../screens/intro/team/create";
import IntroTeamsEditEvents from "../screens/intro/team/edit_events";
import IntroTeamsJoin from "../screens/intro/team/join";
import IntroWhoAmI from "../screens/intro/whoami";
import { isStoreLocked } from "../store";

const App = () => {
	const navigate = useNavigate();

	React.useEffect(() => {
		isStoreLocked().then((locked) => {
			locked && navigate("/admin/finalise");
		});
	});

	return (
		<Routes>
			<Route path={"/intro"} element={<Intro />} />
			<Route path={"/intro/whoami"} element={<IntroWhoAmI />} />
			<Route path={"/intro/individual"} element={<IntroIndividual />}>
				<Route path={"/intro/individual"} element={<IntroIndividualHome />} />
				<Route path={"/intro/individual/signup"} element={<IntroIndividualSignup />} />
				<Route
					path={"/intro/individual/edit_events"}
					element={<IntroIndividualEditEvents />}
				/>
			</Route>
			<Route path={"/intro/team"} element={<IntroTeam />} />
			<Route path={"/intro/team/create"} element={<IntroTeamsCreate />} />
			<Route path={"/intro/team/join"} element={<IntroTeamsJoin />} />
			<Route path={"/intro/team/edit_events"} element={<IntroTeamsEditEvents />} />

			<Route path={"/admin"} element={<AdminMain />} />
			<Route path={"/admin/finalise"} element={<AdminFinalise />} />
			<Route path={"/admin/finalise/end"} element={<AdminFinaliseEnd />} />
			<Route path={"/"} element={<Main />} />
		</Routes>
	);
};

export default App;
