import React from "react";
import { useNavigate } from "react-router-dom";

// The main page is just a redirect to the intro page, used for traditional purposes
// index.html = /
// Just makes sense to have an index page
const Main = () => {
	const navigate = useNavigate();

	React.useEffect(() => {
		navigate("/intro");
	});

	return <></>;
};

export default Main;
