import "leaflet/dist/leaflet.css";
import React, { useState, useMemo, useEffect } from 'react';

import Map from './components/map/Map.tsx';
import LocationsList, { SortOption } from './components/locations-list/LocationsList.tsx';
import LocationDetails from './components/location-details/LocationDetails.tsx';
import LocationManager from './components/location-manager/LocationManager.tsx';
import Location from './core/interfaces/Location.tsx';
import Coordinate from './core/interfaces/Coordinate.tsx';
import { ApiService } from './core/services/api.service.ts';

import './App.scss';

import leftArrow from '../src/assets/icons/angle-left-icon.svg';
import rightArrow from '../src/assets/icons/angle-right-icon.svg';

function App(): React.ReactElement {
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
	const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
	const [centerMapLocation, setCenterMapLocation] = useState<Location | null>(null);
	const [mapClickCoordinates, setMapClickCoordinates] = useState<Coordinate | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	
	// Стани для фільтрації
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [sortOption, setSortOption] = useState<SortOption>('name-asc');

	const [locations, setLocations] = useState<Location[]>([]);

	// Завантаження локацій з API
	useEffect(() => {
		const fetchLocations = async () => {
			try {
				setLoading(true);
				setError(null);
				const fetchedLocations = await ApiService.getLocations();
				setLocations(fetchedLocations);
			} catch (err) {
				console.error('Error fetching locations:', err);
				setError('Помилка завантаження локацій. Перевірте з\'єднання з сервером.');
				setLocations([]); // Порожній масив, якщо сервер не відповідає
			} finally {
				setLoading(false);
			}
		};

		fetchLocations();
	}, []);

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
	const handleLocationCreate = async (locationData: Omit<Location, 'id'>) => {
		try {
			const newLocation = await ApiService.createLocation(locationData);
			setLocations(prevLocations => [...prevLocations, newLocation]);
			setMapClickCoordinates(null);
		} catch (err) {
			console.error('Error creating location:', err);
			setError('Помилка створення локації');
		}
	};

	const handleLocationUpdate = async (updatedLocation: Location) => {
		try {
			const updated = await ApiService.updateLocation(updatedLocation.id, updatedLocation);
			setLocations(prevLocations => 
				prevLocations.map(location => 
					location.id === updated.id ? updated : location
				)
			);
			setSelectedLocation(updated);
		} catch (err) {
			console.error('Error updating location:', err);
			setError('Помилка оновлення локації');
		}
	};

	const handleLocationDelete = async (locationId: string) => {
		try {
			await ApiService.deleteLocation(locationId);
			setLocations(prevLocations => 
				prevLocations.filter(location => location.id !== locationId)
			);
			setSelectedLocation(null);
		} catch (err) {
			console.error('Error deleting location:', err);
			setError('Помилка видалення локації');
		}
	};

	const handleLocationManagerClose = () => {
		setSelectedLocation(null);
		setMapClickCoordinates(null);
	};

	const handleExportGeoJSON = () => {
		const geoJSON = {
			type: "FeatureCollection",
			features: locations.map(location => ({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: [location.coords.lon, location.coords.lat]
				},
				properties: {
					id: location.id,
					name: location.name,
					category: location.category,
					description: location.description,
					createdAt: location.createdAt
				}
			}))
		};

		const dataStr = JSON.stringify(geoJSON, null, 2);
		const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
		
		const exportFileDefaultName = `locations-${new Date().toISOString().split('T')[0]}.geojson`;
		
		const linkElement = document.createElement('a');
		linkElement.setAttribute('href', dataUri);
		linkElement.setAttribute('download', exportFileDefaultName);
		linkElement.click();
	};

	if (loading) {
		return (
			<div className="app">
				<div className="app__loading">
					<p>Завантаження локацій...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="app">
			{error && (
				<div className="app__error">
					<p>{error}</p>
					<button onClick={() => setError(null)}>Закрити</button>
				</div>
			)}
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
						onExportGeoJSON={handleExportGeoJSON}
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
