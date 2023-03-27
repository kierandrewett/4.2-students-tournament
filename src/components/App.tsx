import { Route, Routes } from "react-router-dom";

import Main from "../screens";
import AdminMain from "../screens/admin";
import Intro from "../screens/intro";
import IntroIndividual from "../screens/intro/individual";
import IntroIndividualHome from "../screens/intro/individual/home";
import IntroIndividualSignup from "../screens/intro/individual/signup";
import IntroTeam from "../screens/intro/team";
import IntroTeamsCreate from "../screens/intro/team/create";
import IntroWhoAmI from "../screens/intro/whoami";

const App = () => {
	return (
		<Routes>
			<Route path={"/intro"} element={<Intro />} />
			<Route path={"/intro/whoami"} element={<IntroWhoAmI />} />
			<Route path={"/intro/individual"} element={<IntroIndividual />}>
				<Route path={"/intro/individual"} element={<IntroIndividualHome />} />
				<Route path={"/intro/individual/signup"} element={<IntroIndividualSignup />} />
			</Route>
			<Route path={"/intro/team"} element={<IntroTeam />} />
			<Route path={"/intro/team/create"} element={<IntroTeamsCreate />} />

			<Route path={"/admin"} element={<AdminMain />} />
			<Route path={"/"} element={<Main />} />
		</Routes>
	);
};

export default App;
