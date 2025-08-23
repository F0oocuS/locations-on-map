import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

import Text from './components/test/Text.tsx';

import './App.scss';

import leftArrow from '../src/assets/icons/angle-left-icon.svg';
import rightArrow from '../src/assets/icons/angle-right-icon.svg';
import Map from './components/map/Map.tsx';

function App(): React.ReactElement {
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
	const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

	const handleToggleLeftSidebar = () => {
		setIsLeftSidebarOpen(!isLeftSidebarOpen);
	};

	const handleToggleRightSidebar = () => {
		setIsRightSidebarOpen(!isRightSidebarOpen);
	};
	return (
		<div className="app">
			<div className="app__container">
				<div className={`app__sidebar ${isLeftSidebarOpen ? 'app__sidebar--open' : ''}`}>
					<Text />

					<button className="app__sidebar-toggler" onClick={handleToggleLeftSidebar}>
						<img src={ rightArrow } alt="Right arrow" className="app__toggler-icon"/>
					</button>
				</div>

				<div className="app__content">
					<Map />
				</div>

				<div className={`app__sidebar app__sidebar--right ${isRightSidebarOpen ? 'app__sidebar--open' : ''}`}>
					<Text />

					<button className="app__sidebar-toggler app__sidebar-toggler--right" onClick={handleToggleRightSidebar}>
						<img src={ leftArrow } alt="Left arrow" className="app__toggler-icon"/>
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;
