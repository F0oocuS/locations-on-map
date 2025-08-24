import React, { useMemo } from 'react';
import { LocationFiltersProps } from '../../core/interfaces/props/LocationFiltersProps';
import { LocationsService } from '../../core/services/locations.service';
import './LocationFilters.scss';

function LocationFilters({ searchQuery, onSearchQueryChange, selectedCategories, onCategoriesChange, sortOption, onSortOptionChange, locationsCount }: LocationFiltersProps): React.ReactElement {
	const categories = useMemo(() => {
		return [...LocationsService.CATEGORIES];
	}, []);

	const toggleCategory = (category: string) => {
		if (selectedCategories.includes(category)) {
			onCategoriesChange(selectedCategories.filter((c) => c !== category));
		} else {
			onCategoriesChange([...selectedCategories, category]);
		}
	};

	const resetFilters = () => {
		onSearchQueryChange('');
		onCategoriesChange([]);
		onSortOptionChange('name-asc');
	};

	const hasActiveFilters = LocationsService.hasActiveFilters(searchQuery, selectedCategories, sortOption);

	return (
		<div className="location-filters">
			<div className="location-filters__header">
				<h2>Локації</h2>
				<span className="location-filters__count">{locationsCount}</span>
			</div>

			<div className="location-filters__controls">
				<div className="location-filters__search">
					<input type="text" placeholder="Пошук локацій..." value={searchQuery} onChange={(e) => onSearchQueryChange(e.target.value)} className="location-filters__search-input" />
				</div>

				<div className="location-filters__filters">
					<div className="location-filters__filter">
						<span className="location-filters__filter-label">Категорії:</span>
						<div className="location-filters__category-buttons">
							{categories.map((category) => (
								<button
									key={category}
									className={`location-filters__category-button ${selectedCategories.includes(category) ? 'active' : ''}`}
									onClick={() => toggleCategory(category)}
								>
									{LocationsService.getCategoryName(category)}
								</button>
							))}
						</div>
					</div>

					<div className="location-filters__filter">
						<label htmlFor="sort-filter" className="location-filters__filter-label">
							Сортування:
						</label>
						<select id="sort-filter" value={sortOption} onChange={(e) => onSortOptionChange(e.target.value as any)} className="location-filters__select">
							<option value="name-asc">Назва (А-Я)</option>
							<option value="name-desc">Назва (Я-А)</option>
							<option value="date-asc">Дата (старіші спочатку)</option>
							<option value="date-desc">Дата (новіші спочатку)</option>
						</select>
					</div>
				</div>

				{hasActiveFilters && (
					<div className="location-filters__reset">
						<button onClick={resetFilters} className="location-filters__reset-button">
							Скинути фільтри
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default LocationFilters;
