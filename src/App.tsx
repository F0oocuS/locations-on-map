import 'leaflet/dist/leaflet.css';
import React, { useState, useMemo, useEffect } from 'react';

import Map from './components/map/Map.tsx';
import LocationList from './components/location-list/LocationList.tsx';
import LocationFilters from './components/location-filters/LocationFilters.tsx';
import { SortOption } from './core/types/SortOption';
import LocationDetails from './components/location-details/LocationDetails.tsx';
import LocationManager from './components/location-manager/LocationManager.tsx';
import ConfirmationDialog from './components/confirmation-dialog/ConfirmationDialog.tsx';
import Location from './core/interfaces/Location.tsx';
import Coordinate from './core/interfaces/Coordinate.tsx';
import { ApiService } from './core/services/api.service.ts';
import { GeoJSONService } from './core/services/geojson.service';
import { DialogService } from './core/services/dialog.service';
import { LocationsService } from './core/services/locations.service';

import './App.scss';

import leftArrow from './assets/icons/angle-left-icon.svg';
import rightArrow from './assets/icons/angle-right-icon.svg';

function App(): React.ReactElement {
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
	const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
	const [centerMapLocation, setCenterMapLocation] = useState<Location | null>(null);
	const [mapClickCoordinates, setMapClickCoordinates] = useState<Coordinate | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [mapCenter, setMapCenter] = useState(() => {
		const saved = localStorage.getItem('locations-map-center');
		return saved ? JSON.parse(saved) : [50.4501, 30.5234];
	});
	const [mapZoom, setMapZoom] = useState(() => {
		const saved = localStorage.getItem('locations-map-zoom');
		return saved ? JSON.parse(saved) : 12;
	});

	const [searchQuery, setSearchQuery] = useState(() => {
		const saved = localStorage.getItem('locations-search-query');
		return saved ? JSON.parse(saved) : '';
	});
	const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
		const saved = localStorage.getItem('locations-selected-categories');
		return saved ? JSON.parse(saved) : [];
	});
	const [sortOption, setSortOption] = useState<SortOption>(() => {
		const saved = localStorage.getItem('locations-sort-option');
		return saved ? JSON.parse(saved) : 'name-asc';
	});

	const [locations, setLocations] = useState<Location[]>([]);

	useEffect(() => {
		const fetchLocations = async () => {
			try {
				setLoading(true);
				setError(null);
				const fetchedLocations = await ApiService.getLocations();
				setLocations(fetchedLocations);
			} catch (err) {
				console.error('Error fetching locations:', err);
				setError("Помилка завантаження локацій. Перевірте з'єднання з сервером.");
				setLocations([]);
			} finally {
				setLoading(false);
			}
		};

		fetchLocations();
	}, []);

	useEffect(() => {
		localStorage.setItem('locations-search-query', JSON.stringify(searchQuery));
	}, [searchQuery]);

	useEffect(() => {
		localStorage.setItem('locations-selected-categories', JSON.stringify(selectedCategories));
	}, [selectedCategories]);

	useEffect(() => {
		localStorage.setItem('locations-sort-option', JSON.stringify(sortOption));
	}, [sortOption]);

	useEffect(() => {
		localStorage.setItem('locations-map-center', JSON.stringify(mapCenter));
	}, [mapCenter]);

	useEffect(() => {
		localStorage.setItem('locations-map-zoom', JSON.stringify(mapZoom));
	}, [mapZoom]);

	const filteredAndSortedLocations = useMemo(() => {
		return LocationsService.filterAndSortLocations(locations, searchQuery, selectedCategories, sortOption);
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
		if (coordinates) {
			setMapClickCoordinates(coordinates);
		}
	};

	const handleLocationCreate = async (locationData: Omit<Location, 'id'>) => {
		try {
			const newLocation = await ApiService.createLocation(locationData);
			setLocations((prevLocations) => [...prevLocations, newLocation]);
			setMapClickCoordinates(null);
		} catch (err) {
			console.error('Error creating location:', err);
			setError('Помилка створення локації');
		}
	};

	const handleLocationUpdate = async (updatedLocation: Location) => {
		try {
			const updated = await ApiService.updateLocation(updatedLocation.id, updatedLocation);
			setLocations((prevLocations) => prevLocations.map((location) => (location.id === updated.id ? updated : location)));
			setSelectedLocation(updated);
		} catch (err) {
			console.error('Error updating location:', err);
			setError('Помилка оновлення локації');
		}
		setIsEditMode(false);
	};

	const handleLocationDelete = async (locationId: string) => {
		try {
			await ApiService.deleteLocation(locationId);
			setLocations((prevLocations) => prevLocations.filter((location) => location.id !== locationId));
			setSelectedLocation(null);
		} catch (err) {
			console.error('Error deleting location:', err);
			setError('Помилка видалення локації');
		}
	};

	const handleLocationManagerClose = () => {
		setSelectedLocation(null);
		setMapClickCoordinates(null);
		setIsEditMode(false);
	};

	const handleLocationEdit = (location: Location) => {
		setSelectedLocation(location);
		setIsEditMode(true);
		setIsRightSidebarOpen(true);
	};

	const handleLocationDeleteRequest = (location: Location) => {
		setLocationToDelete(location);
	};

	const handleLocationDeleteConfirm = async () => {
		if (locationToDelete) {
			await handleLocationDelete(locationToDelete.id);
			setLocationToDelete(null);
		}
	};

	const handleLocationDeleteCancel = () => {
		setLocationToDelete(null);
	};

	const handleMapMove = (center: [number, number], zoom: number) => {
		setMapCenter(center);
		setMapZoom(zoom);
	};

	const handleExportGeoJSON = () => {
		GeoJSONService.downloadGeoJSONFile(locations);
	};

	const handleImportGeoJSON = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.geojson,.json';
		input.onchange = async (event) => {
			const file = (event.target as HTMLInputElement).files?.[0];
			if (file) {
				try {
					const importedLocations = await GeoJSONService.processImportFile(file);
					setLocations((prevLocations) => [...prevLocations, ...importedLocations]);
					setError(null);
				} catch (err) {
					console.error('Error importing GeoJSON:', err);
					setError('Помилка імпорту GeoJSON файлу');
				}
			}
		};
		input.click();
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
					<LocationFilters
						searchQuery={searchQuery}
						onSearchQueryChange={setSearchQuery}
						selectedCategories={selectedCategories}
						onCategoriesChange={setSelectedCategories}
						sortOption={sortOption}
						onSortOptionChange={setSortOption}
						locationsCount={filteredAndSortedLocations.length}
					/>
					<LocationList locations={filteredAndSortedLocations} onLocationClick={handleLocationFromList} />

					<button className="app__sidebar-toggler" onClick={handleToggleLeftSidebar}>
						<img src={rightArrow} alt="Right arrow" className="app__toggler-icon" />
					</button>
				</div>

				<div className="app__content">
					<Map
						locations={filteredAndSortedLocations}
						onLocationClick={handleLocationSelect}
						centerMapLocation={centerMapLocation}
						onMapClick={handleMapClick}
						onExportGeoJSON={handleExportGeoJSON}
						onImportGeoJSON={handleImportGeoJSON}
						mapCenter={mapCenter}
						mapZoom={mapZoom}
						onMapMove={handleMapMove}
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
						editMode={isEditMode}
					/>

					<button className="app__sidebar-toggler app__sidebar-toggler--right" onClick={handleToggleRightSidebar}>
						<img src={leftArrow} alt="Left arrow" className="app__toggler-icon" />
					</button>
				</div>
			</div>

			<LocationDetails location={selectedLocation} onClose={handleLocationClose} onEdit={handleLocationEdit} onDelete={handleLocationDeleteRequest} />

			{locationToDelete && (
				<ConfirmationDialog
					isOpen={!!locationToDelete}
					{...DialogService.createDeleteConfirmationConfig(locationToDelete.name)}
					onConfirm={handleLocationDeleteConfirm}
					onCancel={handleLocationDeleteCancel}
				/>
			)}
		</div>
	);
}

export default App;
