import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./components/App";
import { registerKeybinds } from "./keybinds";

// Imports the styling into the frontend
import "./scss/index.scss";

// Creates a root element for where React can render the frontend
const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);

// Render the frontend
root.render(
	<HashRouter>
		<App />
	</HashRouter>
);

// Registers any keybind handlers we might have
registerKeybinds();
