import { isCoordinatesInBounds, MAP_BOUNDS } from '../constants/mapBounds';

export class ValidationService {
	static validateLocationName(name: string): string[] {
		const errors: string[] = [];

		if (!name.trim()) {
			errors.push("Назва локації є обов'язковою");
		}

		return errors;
	}

	static validateCoordinates(lat: number, lon: number): string[] {
		const errors: string[] = [];

		if (lat === 0 && lon === 0) {
			errors.push('Координати не можуть бути 0,0. Оберіть точку на карті або введіть валідні координати');
		} else if (!isCoordinatesInBounds(lat, lon)) {
			errors.push(`Координати повинні бути в межах доступної області карти (${MAP_BOUNDS.minLat} - ${MAP_BOUNDS.maxLat}, ${MAP_BOUNDS.minLon} - ${MAP_BOUNDS.maxLon})`);
		}

		return errors;
	}

	static validateLocationForm(name: string, lat: number, lon: number): string[] {
		const errors: string[] = [];

		errors.push(...this.validateLocationName(name));

		errors.push(...this.validateCoordinates(lat, lon));

		return errors;
	}
}
