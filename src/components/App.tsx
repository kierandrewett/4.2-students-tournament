import { Route, Routes } from "react-router-dom";

import Main from "../screens";
import Intro from "../screens/intro";

const App = () => {
	return (
		<Routes>
			<Route path={"/intro"} element={<Intro />} />
			<Route path={"/"} element={<Main />} />
		</Routes>
	);
};

export default App;
