import React, { useMemo } from 'react';
import Location from '../../core/interfaces/Location.tsx';
import './LocationsList.scss';

export type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc';

interface LocationsListProps {
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

function LocationsList({ 
	locations, 
	filteredLocations, 
	onLocationClick,
	searchQuery,
	onSearchQueryChange,
	selectedCategories,
	onCategoriesChange,
	sortOption,
	onSortOptionChange
}: LocationsListProps): React.ReactElement {

	const categories = useMemo(() => {
		const uniqueCategories = Array.from(new Set(locations.map(loc => loc.category)));
		return uniqueCategories;
	}, [locations]);

	const getCategoryIcon = (category: string): string => {
		switch (category) {
			case 'food': return '🍽️';
			case 'park': return '🌳';
			case 'museum': return '🏛️';
			case 'shop': return '🛍️';
			default: return '📍';
		}
	};

	const getCategoryName = (category: string): string => {
		switch (category) {
			case 'food': return 'Їжа';
			case 'park': return 'Парк';
			case 'museum': return 'Музей';
			case 'shop': return 'Магазин';
			default: return 'Інше';
		}
	};

	const toggleCategory = (category: string) => {
		if (selectedCategories.includes(category)) {
			onCategoriesChange(selectedCategories.filter(c => c !== category));
		} else {
			onCategoriesChange([...selectedCategories, category]);
		}
	};

	const resetFilters = () => {
		onSearchQueryChange('');
		onCategoriesChange([]);
		onSortOptionChange('name-asc');
	};

	const hasActiveFilters = searchQuery.trim() !== '' || selectedCategories.length > 0 || sortOption !== 'name-asc';

	return (
		<div className="locations-list">
			<div className="locations-list__header">
				<h2>Локації</h2>
				<span className="locations-list__count">{filteredLocations.length}</span>
			</div>

			<div className="locations-list__controls">
				<div className="locations-list__search">
					<input
						type="text"
						placeholder="Пошук локацій..."
						value={searchQuery}
						onChange={(e) => onSearchQueryChange(e.target.value)}
						className="locations-list__search-input"
					/>
				</div>

				<div className="locations-list__filters">
					<div className="locations-list__filter">
						<span className="locations-list__filter-label">
							Категорії:
						</span>
						<div className="locations-list__category-buttons">
							{categories.map(category => (
								<button
									key={category}
									className={`locations-list__category-button ${
										selectedCategories.includes(category) ? 'active' : ''
									}`}
									onClick={() => toggleCategory(category)}
								>
									<span className="locations-list__category-icon">
										{getCategoryIcon(category)}
									</span>
									{getCategoryName(category)}
								</button>
							))}
						</div>
					</div>

					<div className="locations-list__filter">
						<label htmlFor="sort-filter" className="locations-list__filter-label">
							Сортування:
						</label>
						<select
							id="sort-filter"
							value={sortOption}
							onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
							className="locations-list__select"
						>
							<option value="name-asc">Назва (А-Я)</option>
							<option value="name-desc">Назва (Я-А)</option>
							<option value="date-asc">Дата (старіші спочатку)</option>
							<option value="date-desc">Дата (новіші спочатку)</option>
						</select>
					</div>
				</div>

				{hasActiveFilters && (
					<div className="locations-list__reset">
						<button 
							onClick={resetFilters}
							className="locations-list__reset-button"
						>
							Скинути фільтри
						</button>
					</div>
				)}
			</div>
			
			<div className="locations-list__items">
				{filteredLocations.length > 0 ? (
					filteredLocations.map((location) => (
						<div 
							key={location.id} 
							className="locations-list__item"
							onClick={() => onLocationClick(location)}
						>
							<div className="locations-list__item-content">
								<span className="locations-list__name">{location.name}</span>
							</div>
						</div>
					))
				) : (
					<div className="locations-list__empty">
						<p>Локацій не знайдено</p>
						{hasActiveFilters && (
							<button 
								onClick={resetFilters}
								className="locations-list__reset-button"
							>
								Скинути фільтри
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default LocationsList;