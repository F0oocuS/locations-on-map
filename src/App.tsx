import React, { useState } from 'react';
import "leaflet/dist/leaflet.css";

import Map from './components/map/Map.tsx';
import LocationsList from './components/locations-list/LocationsList.tsx';
import LocationDetails from './components/location-details/LocationDetails.tsx';
import Location from './core/interfaces/Location.tsx';

import './App.scss';

import leftArrow from '../src/assets/icons/angle-left-icon.svg';
import rightArrow from '../src/assets/icons/angle-right-icon.svg';

function App(): React.ReactElement {
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
	const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
	const [centerMapLocation, setCenterMapLocation] = useState<Location | null>(null);

	const testLocations: Location[] = [
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
	return (
		<div className="app">
			<div className="app__container">
				<div className={`app__sidebar ${isLeftSidebarOpen ? 'app__sidebar--open' : ''}`}>
					<LocationsList 
						locations={testLocations} 
						onLocationClick={handleLocationFromList}
					/>

					<button className="app__sidebar-toggler" onClick={handleToggleLeftSidebar}>
						<img src={ rightArrow } alt="Right arrow" className="app__toggler-icon"/>
					</button>
				</div>

				<div className="app__content">
					<Map 
						locations={testLocations}
						onLocationClick={handleLocationSelect}
						centerMapLocation={centerMapLocation}
					/>
				</div>

				<div className={`app__sidebar app__sidebar--right ${isRightSidebarOpen ? 'app__sidebar--open' : ''}`}>

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
