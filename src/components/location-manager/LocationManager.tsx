import React, { useState, useEffect } from 'react';
import Location from '../../core/interfaces/Location.tsx';
import Coordinate from '../../core/interfaces/Coordinate.tsx';
import { isCoordinatesInBounds, MAP_BOUNDS } from '../../core/constants/mapBounds.ts';
import './LocationManager.scss';

interface LocationManagerProps {
	selectedLocation: Location | null;
	onLocationUpdate: (location: Location) => void;
	onLocationDelete: (locationId: string) => void;
	onLocationCreate: (location: Omit<Location, 'id'>) => void;
	onClose: () => void;
	mapClickCoordinates: Coordinate | null;
}

type LocationManagerMode = 'list' | 'create' | 'edit' | 'view';

const LocationManager: React.FC<LocationManagerProps> = ({
	selectedLocation,
	onLocationUpdate,
	onLocationDelete,
	onLocationCreate,
	onClose,
	mapClickCoordinates
}) => {
	
	const [mode, setMode] = useState<LocationManagerMode>('list');
	const [formData, setFormData] = useState({
		name: '',
		category: 'other' as 'food' | 'park' | 'museum' | 'shop' | 'other',
		description: '',
		lat: 0,
		lon: 0
	});
	const [validationErrors, setValidationErrors] = useState<string[]>([]);

	useEffect(() => {
		if (selectedLocation) {
			setMode('view');
		} else {
			setMode('list');
		}
	}, [selectedLocation]);

	useEffect(() => {
		if (mode === 'create' && mapClickCoordinates) {
			setFormData(prev => ({
				...prev,
				lat: mapClickCoordinates.lat,
				lon: mapClickCoordinates.lon
			}));
		}
	}, [mapClickCoordinates, mode]);

	useEffect(() => {
		if (mode === 'edit' && selectedLocation) {
			setFormData({
				name: selectedLocation.name,
				category: selectedLocation.category,
				description: selectedLocation.description || '',
				lat: selectedLocation.coords.lat,
				lon: selectedLocation.coords.lon
			});
			setValidationErrors([]);
		} else if (mode === 'create') {
			resetForm();
		}
	}, [mode, selectedLocation]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		const newValue = name === 'lat' || name === 'lon' ? parseFloat(value) || 0 : value;
		
		setFormData(prev => ({
			...prev,
			[name]: newValue
		}));

		// Очищаємо попередні помилки валідації при зміні полів
		setValidationErrors([]);
	};

	const validateForm = (): boolean => {
		const errors: string[] = [];

		// Перевірка назви
		if (!formData.name.trim()) {
			errors.push('Назва локації є обов\'язковою');
		}

		// Перевірка координат
		if (formData.lat === 0 && formData.lon === 0) {
			errors.push('Координати не можуть бути 0,0. Оберіть точку на карті або введіть валідні координати');
		} else if (!isCoordinatesInBounds(formData.lat, formData.lon)) {
			errors.push(`Координати повинні бути в межах доступної області карти (${MAP_BOUNDS.minLat} - ${MAP_BOUNDS.maxLat}, ${MAP_BOUNDS.minLon} - ${MAP_BOUNDS.maxLon})`);
		}

		setValidationErrors(errors);
		return errors.length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateForm()) {
			return;
		}
		
		if (mode === 'create') {
			const locationData = {
				name: formData.name,
				category: formData.category,
				description: formData.description,
				coords: { lat: formData.lat, lon: formData.lon }
			};
			onLocationCreate(locationData);
		} else if (mode === 'edit' && selectedLocation) {
			const locationData = {
				id: selectedLocation.id,
				name: formData.name,
				category: formData.category,
				description: formData.description,
				createdAt: selectedLocation.createdAt, // Зберігаємо оригінальну дату при редагуванні
				coords: { lat: formData.lat, lon: formData.lon }
			};
			onLocationUpdate(locationData);
		}
		
		setMode('list');
		resetForm();
	};

	const handleEdit = () => {
		if (selectedLocation) {
			setMode('edit');
		}
	};

	const handleDelete = () => {
		if (selectedLocation && window.confirm(`Видалити локацію "${selectedLocation.name}"?`)) {
			onLocationDelete(selectedLocation.id);
			setMode('list');
			onClose();
		}
	};

	const handleCancel = () => {
		setMode(selectedLocation ? 'view' : 'list');
		resetForm();
	};

	const resetForm = () => {
		setFormData({
			name: '',
			category: 'other',
			description: '',
			lat: 0,
			lon: 0
		});
		setValidationErrors([]);
	};

	const handleCreateNew = () => {
		setMode('create');
		resetForm();
		onClose();
	};

	const getCategoryLabel = (category: string) => {
		const labels = {
			food: 'Їжа',
			park: 'Парк',
			museum: 'Музей',
			shop: 'Магазин',
			other: 'Інше'
		};
		return labels[category as keyof typeof labels] || category;
	};

	if (mode === 'create' || mode === 'edit') {
		return (
			<div className="location-manager">
				<div className="location-manager__header">
					<h3>{mode === 'create' ? 'Створити локацію' : 'Редагувати локацію'}</h3>
				</div>
				
				{validationErrors.length > 0 && (
					<div className="location-manager__errors">
						{validationErrors.map((error, index) => (
							<p key={index} className="location-manager__error">{error}</p>
						))}
					</div>
				)}
				
				<form className="location-manager__form" onSubmit={handleSubmit}>
					<div className="location-manager__field">
						<label htmlFor="name">Назва*</label>
						<input
							id="name"
							name="name"
							type="text"
							value={formData.name}
							onChange={handleInputChange}
							required
						/>
					</div>

					<div className="location-manager__field">
						<label htmlFor="category">Категорія*</label>
						<select
							id="category"
							name="category"
							value={formData.category}
							onChange={handleInputChange}
							required
						>
							<option value="food">Їжа</option>
							<option value="park">Парк</option>
							<option value="museum">Музей</option>
							<option value="shop">Магазин</option>
							<option value="other">Інше</option>
						</select>
					</div>

					<div className="location-manager__field">
						<label htmlFor="description">Опис</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							rows={3}
						/>
					</div>

					<div className="location-manager__coordinates">
						<div className="location-manager__field">
							<label htmlFor="lat">Широта*</label>
							<input
								id="lat"
								name="lat"
								type="number"
								step="any"
								value={formData.lat}
								onChange={handleInputChange}
								min={MAP_BOUNDS.minLat}
								max={MAP_BOUNDS.maxLat}
								placeholder={`${MAP_BOUNDS.minLat} - ${MAP_BOUNDS.maxLat}`}
								required
							/>
						</div>
						<div className="location-manager__field">
							<label htmlFor="lon">Довгота*</label>
							<input
								id="lon"
								name="lon"
								type="number"
								step="any"
								value={formData.lon}
								onChange={handleInputChange}
								min={MAP_BOUNDS.minLon}
								max={MAP_BOUNDS.maxLon}
								placeholder={`${MAP_BOUNDS.minLon} - ${MAP_BOUNDS.maxLon}`}
								required
							/>
						</div>
					</div>
					
					<div className="location-manager__coordinates-hint">
						<p>💡 Підказка: Клікніть на карту для автоматичного заповнення координат або введіть їх в межах доступної області Києва</p>
					</div>

					<div className="location-manager__actions">
						<button type="button" className="location-manager__btn location-manager__btn--secondary" onClick={handleCancel}>
							Скасувати
						</button>
						<button type="submit" className="location-manager__btn location-manager__btn--primary">
							{mode === 'create' ? 'Створити' : 'Зберегти'}
						</button>
					</div>
				</form>
			</div>
		);
	}

	if (mode === 'view' && selectedLocation) {
		return (
			<div className="location-manager">
				<div className="location-manager__header">
					<h3>{selectedLocation.name}</h3>
				</div>
				
				<div className="location-manager__content">
					<div className="location-manager__info">
						<p><strong>Категорія:</strong> {getCategoryLabel(selectedLocation.category)}</p>
						{selectedLocation.description && (
							<p><strong>Опис:</strong> {selectedLocation.description}</p>
						)}
						<p><strong>Координати:</strong> {selectedLocation.coords.lat.toFixed(4)}, {selectedLocation.coords.lon.toFixed(4)}</p>
						<p><strong>Створено:</strong> {selectedLocation.createdAt}</p>
					</div>

					<div className="location-manager__actions">
						<button 
							className="location-manager__btn location-manager__btn--primary" 
							onClick={handleEdit}
						>
							Редагувати
						</button>
						<button 
							className="location-manager__btn location-manager__btn--danger" 
							onClick={handleDelete}
						>
							Видалити
						</button>
					</div>
				</div>
			</div>
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