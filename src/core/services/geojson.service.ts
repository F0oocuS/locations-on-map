import Location from '../interfaces/Location';

export class GeoJSONService {
	static exportLocationsToGeoJSON(locations: Location[]): object {
		return {
			type: 'FeatureCollection',
			features: locations.map((location) => ({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [location.coords.lon, location.coords.lat],
				},
				properties: {
					id: location.id,
					name: location.name,
					category: location.category,
					description: location.description,
					createdAt: location.createdAt,
				},
			})),
		};
	}

	static downloadGeoJSONFile(locations: Location[]): void {
		const geoJSON = GeoJSONService.exportLocationsToGeoJSON(locations);
		const dataStr = JSON.stringify(geoJSON, null, 2);
		const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

		const exportFileDefaultName = `locations-${new Date().toISOString().split('T')[0]}.geojson`;

		const linkElement = document.createElement('a');
		linkElement.setAttribute('href', dataUri);
		linkElement.setAttribute('download', exportFileDefaultName);
		linkElement.click();
	}

	static validateGeoJSON(geoJSON: any): boolean {
		return geoJSON.type === 'FeatureCollection' && Array.isArray(geoJSON.features);
	}

	static convertGeoJSONToLocations(geoJSON: any): Omit<Location, 'id'>[] {
		if (!GeoJSONService.validateGeoJSON(geoJSON)) {
			throw new Error('Невірний формат GeoJSON файлу');
		}

		return geoJSON.features.map((feature: any) => ({
			name: feature.properties.name || 'Imported Location',
			category: feature.properties.category || 'other',
			description: feature.properties.description || '',
			coords: {
				lat: feature.geometry.coordinates[1],
				lon: feature.geometry.coordinates[0],
			},
		}));
	}

	static generateImportedLocations(geoJSON: any): Location[] {
		const baseLocations = GeoJSONService.convertGeoJSONToLocations(geoJSON);
		const timestamp = Date.now();

		return baseLocations.map((locationData, index) => ({
			...locationData,
			id: `imported-${timestamp}-${index}`,
			createdAt: new Date().toISOString(),
		}));
	}

	static async processImportFile(file: File): Promise<Location[]> {
		try {
			const text = await file.text();
			const geoJSON = JSON.parse(text);
			return GeoJSONService.generateImportedLocations(geoJSON);
		} catch (error) {
			throw new Error('Помилка імпорту GeoJSON файлу');
		}
	}
}
