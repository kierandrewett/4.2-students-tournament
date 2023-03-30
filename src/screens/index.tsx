import React from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
	const navigate = useNavigate();

	React.useEffect(() => {
		navigate("/intro");
	});

	return <></>;
};

export default Main;
