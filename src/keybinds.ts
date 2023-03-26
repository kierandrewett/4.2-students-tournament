import { hotkeys } from "@ekwoka/hotkeys";
import { invoke } from "@tauri-apps/api";

export const registerKeybinds = () => {
	hotkeys({
		"`": () => invoke("open_devtools")
	});
};
