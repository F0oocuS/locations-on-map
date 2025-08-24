import Location from '../Location';
import { SortOption } from '../../types/SortOption';

export interface LocationsListProps {
	locations: Location[];
	filteredLocations: Location[];
	onLocationClick: (location: Location) => void;
	searchQuery: string;
	onSearchQueryChange: (query: string) => void;
	selectedCategories: string[];
	onCategoriesChange: (categories: string[]) => void;
	sortOption: SortOption;
	onSortOptionChange: (option: SortOption) => void;
}