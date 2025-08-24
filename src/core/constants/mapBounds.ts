export const MAP_BOUNDS = {
	minLat: 50.2133,
	maxLat: 50.59,
	minLon: 30.2394,
	maxLon: 30.825,
};

export const isCoordinatesInBounds = (lat: number, lon: number): boolean => {
	return lat >= MAP_BOUNDS.minLat && lat <= MAP_BOUNDS.maxLat && lon >= MAP_BOUNDS.minLon && lon <= MAP_BOUNDS.maxLon;
};
