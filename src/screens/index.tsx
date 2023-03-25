import React from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
	const navigate = useNavigate();

	React.useEffect(() => {
		navigate("/intro");
	});

	return <h1>hello</h1>;
};

export default Main;
