import { SortOption } from '../../types/SortOption';

export interface LocationFiltersProps {
	searchQuery: string;
	onSearchQueryChange: (query: string) => void;
	selectedCategories: string[];
	onCategoriesChange: (categories: string[]) => void;
	sortOption: SortOption;
	onSortOptionChange: (option: SortOption) => void;
	locationsCount: number;
}
