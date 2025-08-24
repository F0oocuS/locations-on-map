import Location from '../interfaces/Location';
import { SortOption } from '../types/SortOption';

export class LocationsService {
	static readonly CATEGORIES = ['food', 'park', 'museum', 'shop', 'other'] as const;

	static getCategoryName(category: string): string {
		switch (category) {
			case 'food':
				return 'Їжа';
			case 'park':
				return 'Парк';
			case 'museum':
				return 'Музей';
			case 'shop':
				return 'Магазин';
			default:
				return 'Інше';
		}
	}

	static formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('uk-UA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	}

	static hasActiveFilters(searchQuery: string, selectedCategories: string[], sortOption: string): boolean {
		return searchQuery.trim() !== '' || selectedCategories.length > 0 || sortOption !== 'name-asc';
	}

	static filterAndSortLocations(locations: Location[], searchQuery: string, selectedCategories: string[], sortOption: SortOption): Location[] {
		let result = locations;

		if (selectedCategories.length > 0) {
			result = result.filter((location) => selectedCategories.includes(location.category));
		}

		if (searchQuery.trim()) {
			result = result.filter(
				(location) =>
					location.name.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		result = [...result].sort((a, b) => {
			switch (sortOption) {
				case 'name-asc':
					return a.name.localeCompare(b.name, 'uk');
				case 'name-desc':
					return b.name.localeCompare(a.name, 'uk');
				case 'date-asc':
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				case 'date-desc':
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				default:
					return 0;
			}
		});

		return result;
	}
}
