import "leaflet/dist/leaflet.css";
import React, { useState, useMemo } from 'react';

import Map from './components/map/Map.tsx';
import LocationsList, { SortOption } from './components/locations-list/LocationsList.tsx';
import LocationDetails from './components/location-details/LocationDetails.tsx';
import LocationManager from './components/location-manager/LocationManager.tsx';
import Location from './core/interfaces/Location.tsx';
import Coordinate from './core/interfaces/Coordinate.tsx';

import './App.scss';

import leftArrow from '../src/assets/icons/angle-left-icon.svg';
import rightArrow from '../src/assets/icons/angle-right-icon.svg';

function App(): React.ReactElement {
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
	const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
	const [centerMapLocation, setCenterMapLocation] = useState<Location | null>(null);
	const [mapClickCoordinates, setMapClickCoordinates] = useState<Coordinate | null>(null);
	
	// Стани для фільтрації
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [sortOption, setSortOption] = useState<SortOption>('name-asc');

	const initialLocations: Location[] = [
		{
			id: '1',
			name: 'Майдан Незалежності',
			category: 'other',
			description: 'Головна площа України',
			createdAt: '2024-01-01',
			coords: { lat: 50.4501, lon: 30.5234 }
		},
		{
			id: '2',
			name: 'Золоті ворота',
			category: 'museum',
			description: 'Історична пам\'ятка Києва',
			createdAt: '2024-01-02',
			coords: { lat: 50.4487, lon: 30.5131 }
		},
		{
			id: '3',
			name: 'Софійський собор',
			category: 'museum',
			description: 'Унікальна архітектурна пам\'ятка',
			createdAt: '2024-01-03',
			coords: { lat: 50.4528, lon: 30.5146 }
		},
		{
			id: '4',
			name: 'Парк Шевченка',
			category: 'park',
			description: 'Великий міський парк',
			createdAt: '2024-01-04',
			coords: { lat: 50.4481, lon: 30.4581 }
		},
		{
			id: '5',
			name: 'ЦУМ',
			category: 'shop',
			description: 'Центральний універмаг',
			createdAt: '2024-01-05',
			coords: { lat: 50.4467, lon: 30.5203 }
		},
		{
			id: '6',
			name: 'Ресторан Канапа',
			category: 'food',
			description: 'Українська кухня',
			createdAt: '2024-01-06',
			coords: { lat: 50.4515, lon: 30.5147 }
		},
		{
			id: '7',
			name: 'Гідропарк',
			category: 'park',
			description: 'Острів для відпочинку',
			createdAt: '2024-01-07',
			coords: { lat: 50.4649, lon: 30.5763 }
		},
		{
			id: '8',
			name: 'Бессарабський ринок',
			category: 'food',
			description: 'Історичний продуктовий ринок',
			createdAt: '2024-01-08',
			coords: { lat: 50.4410, lon: 30.5194 }
		},
		{
			id: '9',
			name: 'Океан Плаза',
			category: 'shop',
			description: 'Торговельний центр',
			createdAt: '2024-01-09',
			coords: { lat: 50.4333, lon: 30.5178 }
		},
		{
			id: '10',
			name: 'Музей однієї вулиці',
			category: 'museum',
			description: 'Унікальний музей на Андріївському узвозі',
			createdAt: '2024-01-10',
			coords: { lat: 50.4572, lon: 30.5188 }
		}
	];

	const [locations, setLocations] = useState<Location[]>(initialLocations);

	// Логіка фільтрації та сортування
	const filteredAndSortedLocations = useMemo(() => {
		let result = locations;

		// Фільтрація за категоріями
		if (selectedCategories.length > 0) {
			result = result.filter(location => selectedCategories.includes(location.category));
		}

		// Фільтрація за пошуковим запитом
		if (searchQuery.trim()) {
			result = result.filter(location =>
				location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				location.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				location.category.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		// Сортування
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
	}, [locations, searchQuery, selectedCategories, sortOption]);

	const handleToggleLeftSidebar = () => {
		setIsLeftSidebarOpen(!isLeftSidebarOpen);
	};

	const handleToggleRightSidebar = () => {
		setIsRightSidebarOpen(!isRightSidebarOpen);
	};

	const handleLocationSelect = (location: Location) => {
		setSelectedLocation(location);
	};

	const handleLocationClose = () => {
		setSelectedLocation(null);
	};

	const handleLocationFromList = (location: Location) => {
		setSelectedLocation(location);
		setCenterMapLocation(location);
	};

	const handleMapClick = (coordinates?: Coordinate) => {
		setSelectedLocation(null);
		if (coordinates) {
			setMapClickCoordinates(coordinates);
		}
	};

	// Обробники для LocationManager
	const handleLocationCreate = (locationData: Omit<Location, 'id'>) => {
		const newLocation: Location = {
			...locationData,
			id: `location_${Date.now()}`
		};
		setLocations(prevLocations => [...prevLocations, newLocation]);
		setMapClickCoordinates(null);
	};

	const handleLocationUpdate = (updatedLocation: Location) => {
		setLocations(prevLocations => 
			prevLocations.map(location => 
				location.id === updatedLocation.id ? updatedLocation : location
			)
		);
		setSelectedLocation(updatedLocation);
	};

	const handleLocationDelete = (locationId: string) => {
		setLocations(prevLocations => 
			prevLocations.filter(location => location.id !== locationId)
		);
		setSelectedLocation(null);
	};

	const handleLocationManagerClose = () => {
		setSelectedLocation(null);
		setMapClickCoordinates(null);
	};
	return (
		<div className="app">
			<div className="app__container">
				<div className={`app__sidebar ${isLeftSidebarOpen ? 'app__sidebar--open' : ''}`}>
					<LocationsList 
						locations={locations}
						filteredLocations={filteredAndSortedLocations}
						onLocationClick={handleLocationFromList}
						searchQuery={searchQuery}
						onSearchQueryChange={setSearchQuery}
						selectedCategories={selectedCategories}
						onCategoriesChange={setSelectedCategories}
						sortOption={sortOption}
						onSortOptionChange={setSortOption}
					/>

					<button className="app__sidebar-toggler" onClick={handleToggleLeftSidebar}>
						<img src={ rightArrow } alt="Right arrow" className="app__toggler-icon"/>
					</button>
				</div>

				<div className="app__content">
					<Map 
						locations={filteredAndSortedLocations}
						onLocationClick={handleLocationSelect}
						centerMapLocation={centerMapLocation}
						onMapClick={handleMapClick}
					/>
				</div>

				<div className={`app__sidebar app__sidebar--right ${isRightSidebarOpen ? 'app__sidebar--open' : ''}`}>
					<LocationManager
						selectedLocation={selectedLocation}
						onLocationUpdate={handleLocationUpdate}
						onLocationDelete={handleLocationDelete}
						onLocationCreate={handleLocationCreate}
						onClose={handleLocationManagerClose}
						mapClickCoordinates={mapClickCoordinates}
					/>

					<button className="app__sidebar-toggler app__sidebar-toggler--right" onClick={handleToggleRightSidebar}>
						<img src={ leftArrow } alt="Left arrow" className="app__toggler-icon"/>
					</button>
				</div>
			</div>

			<LocationDetails 
				location={selectedLocation}
				onClose={handleLocationClose}
			/>
		</div>
	);
}

export default App;
