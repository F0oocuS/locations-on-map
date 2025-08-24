// Межі доступної області карти (Київ)
export const MAP_BOUNDS = {
	minLat: 50.2133,
	maxLat: 50.5900,
	minLon: 30.2394,
	maxLon: 30.8250
};

export const isCoordinatesInBounds = (lat: number, lon: number): boolean => {
	return lat >= MAP_BOUNDS.minLat &&
		lat <= MAP_BOUNDS.maxLat &&
		lon >= MAP_BOUNDS.minLon &&
		lon <= MAP_BOUNDS.maxLon;
};