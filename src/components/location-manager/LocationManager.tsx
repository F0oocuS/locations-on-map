import React, { useState, useEffect } from 'react';
import LocationForm from '../location-form/LocationForm.tsx';
import { LocationManagerProps } from '../../core/interfaces/props/LocationManagerProps';
import { LocationManagerMode } from '../../core/types/LocationManagerMode';
import './LocationManager.scss';

const LocationManager: React.FC<LocationManagerProps> = ({
	selectedLocation,
	onLocationUpdate,
	onLocationCreate,
	onClose,
	mapClickCoordinates,
	editMode
}) => {
	
	const [mode, setMode] = useState<LocationManagerMode>('list');

	useEffect(() => {
		if (selectedLocation && editMode) {
			setMode('edit');
		} else if (selectedLocation) {
			setMode('view');
		} else {
			setMode('list');
		}
	}, [selectedLocation, editMode]);

	const handleFormSubmit = (locationData: any) => {
		if (mode === 'create') {
			onLocationCreate(locationData);
		} else if (mode === 'edit') {
			onLocationUpdate(locationData);
		}
		
		setMode('list');
	};

	const handleFormCancel = () => {
		setMode('list');
		onClose();
	};

	const handleCreateNew = () => {
		setMode('create');
		onClose();
	};

	if (mode === 'create' || mode === 'edit') {
		return (
			<LocationForm
				mode={mode}
				location={selectedLocation}
				mapClickCoordinates={mapClickCoordinates}
				onSubmit={handleFormSubmit}
				onCancel={handleFormCancel}
			/>
		);
	}


	return (
		<div className="location-manager">
			<div className="location-manager__header">
				<h3>Керування локаціями</h3>
			</div>
			
			<div className="location-manager__content">
				<p>Оберіть локацію на карті або в списку для редагування</p>
				
				<div className="location-manager__actions">
					<button 
						className="location-manager__btn location-manager__btn--primary location-manager__btn--full" 
						onClick={handleCreateNew}
					>
						+ Додати локацію
					</button>
				</div>
			</div>
		</div>
	);
};

export default LocationManager;