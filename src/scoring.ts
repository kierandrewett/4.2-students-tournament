import { EventData } from "./types";

// This function calculates the points for a given rank
// Uses our scoring system algorithm
export const calculatePointsForRank = ({
	event,
	position
}: {
	event: EventData;
	position: number;
}) => {
	// Get the first place prize from the event argument
	const firstPlacePrize = event.max_points;

	// Math.round - rounds the result to the nearest integer
	// firstPlacePrize - the prize given for getting first place (we don't want to manipulate this)
	// 0.8 - is just 100% - 20% (1.0 - 0.2)
	// ** - is the exponentiation operator (2 ** 2 = 4)
	// (position - 1) - since the position variable starts counting at 1, we need to subtract 1 to get the correct exponent
	return Math.round(firstPlacePrize * 0.8 ** (position - 1));
};
