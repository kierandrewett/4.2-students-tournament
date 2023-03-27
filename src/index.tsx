import ReactDOM from "react-dom/client";
import Modal from "react-modal";
import { HashRouter } from "react-router-dom";
import App from "./components/App";
import { registerKeybinds } from "./keybinds";
import * as tmStore from "./store";

// Imports the styling into the frontend
import "./scss/index.scss";

// Creates a root element for where React can render the frontend
const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);

// Bind the modals to our root element
Modal.setAppElement("#app");

// Render the frontend
root.render(
	<HashRouter>
		<App />
	</HashRouter>
);

// Registers any keybind handlers we might have
registerKeybinds();

// Expose the IPCStore to the window
window.store = tmStore.store;
