import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";

import "./scss/index.scss";

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
