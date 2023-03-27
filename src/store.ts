import { invoke } from "@tauri-apps/api";
import { EventCallback, listen } from "@tauri-apps/api/event";
import { homeDir, resolve } from "@tauri-apps/api/path";

export const getStorePath = async (store: string) => {
	const home = await homeDir();
	return resolve(home, ".students_tournament", `${store}.store.json`);
};

class IPCStore {
	public constructor(public store: string) {}

	call<T = any>(fn_name: string, data?: any): Promise<T> {
		const rustEventName = `${this.store}__${fn_name}`;

		return invoke(rustEventName, data || {});
	}

	on<T>(event_name: string, callback: EventCallback<T>) {
		const rustEventName = `${this.store}__on_${event_name}`;

		listen<T>(rustEventName, callback);
	}
}

export const store = {
	events: new IPCStore("events"),
	teams: new IPCStore("teams"),
	individuals: new IPCStore("individuals")
};
