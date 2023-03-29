import { EventData } from "./types";

export const calculatePointsForRank = ({
	event,
	position
}: {
	event: EventData;
	position: number;
}) => {
	const firstPlacePrize = event.max_points;

	return Math.round(firstPlacePrize * 0.8 ** (position - 1));
};
