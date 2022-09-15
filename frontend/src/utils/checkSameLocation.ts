export default function checkSameLocation (first_location: number[], second_location: number[]) {
	if (first_location.length !== second_location.length) return false;
	for (var i = 0; i < first_location.length; i++) { if (first_location[i] !== second_location[i]) return false };
	return true;
};