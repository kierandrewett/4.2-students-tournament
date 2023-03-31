// General TypeScript type definitions
// We will use these if we want more explicit and advanced types

import * as tmStore from "./store";

export declare global {
	interface Window {
		store: typeof tmStore.store;
	}
}

export enum EventType {
	Individual = "Individual",
	Team = "Team"
}

export interface EventData {
	id: number;
	name: string;
	kind: EventType;
	max_points: number;
	max_teams: number | null;
}

export interface IndividualData {
	id: number;
	name: string;
	events_ids_entered: number[];
}

export interface TeamPlayerData {
	id: number;
	name: string;
}

export interface TeamData {
	id: number;
	name: string;
	events_ids_entered: number[];
	players?: TeamPlayerData[];
}

export interface ResultData {
	event_id: number;
	done: boolean;
	results: {
		participant_id: number;
		points: number;
		position: number;
	}[];
}
