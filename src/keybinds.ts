import { hotkeys } from "@ekwoka/hotkeys";
import { invoke } from "@tauri-apps/api";

// Register keybinds that may be used
export const registerKeybinds = () => {
	hotkeys({
		"`": () => invoke("open_devtools") // This one doesn't really matter in prod as Tauri disables devtools in release builds
	});
};
