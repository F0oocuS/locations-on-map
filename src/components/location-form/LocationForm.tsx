import React, { useState, useEffect } from 'react';
import Location from '../../core/interfaces/Location.tsx';
import Coordinate from '../../core/interfaces/Coordinate.tsx';
import { isCoordinatesInBounds, MAP_BOUNDS } from '../../core/constants/mapBounds.ts';
import './LocationForm.scss';

interface LocationFormProps {
	mode: 'create' | 'edit';
	location?: Location | null;
	mapClickCoordinates?: Coordinate | null;
	onSubmit: (locationData: Omit<Location, 'id'> | Location) => void;
	onCancel: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({
	mode,
	location,
	mapClickCoordinates,
	onSubmit,
	onCancel
}) => {
	const [formData, setFormData] = useState({
		name: '',
		category: 'other' as 'food' | 'park' | 'museum' | 'shop' | 'other',
		description: '',
		lat: 0,
		lon: 0
	});
	const [validationErrors, setValidationErrors] = useState<string[]>([]);

	useEffect(() => {
		if ((mode === 'create' || mode === 'edit') && mapClickCoordinates) {
			setFormData(prev => ({
				...prev,
				lat: mapClickCoordinates.lat,
				lon: mapClickCoordinates.lon
			}));
		}
	}, [mapClickCoordinates, mode]);

	useEffect(() => {
		if (mode === 'edit' && location) {
			setFormData({
				name: location.name,
				category: location.category,
				description: location.description || '',
				lat: location.coords.lat,
				lon: location.coords.lon
			});
			setValidationErrors([]);
		} else if (mode === 'create') {
			resetForm();
		}
	}, [mode, location]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		const newValue = name === 'lat' || name === 'lon' ? parseFloat(value) || 0 : value;
		
		setFormData(prev => ({
			...prev,
			[name]: newValue
		}));

		setValidationErrors([]);
	};

	const validateForm = (): boolean => {
		const errors: string[] = [];

		if (!formData.name.trim()) {
			errors.push('Назва локації є обов\'язковою');
		}

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
			onSubmit(locationData);
		} else if (mode === 'edit' && location) {
			const locationData = {
				id: location.id,
				name: formData.name,
				category: formData.category,
				description: formData.description,
				createdAt: location.createdAt,
				coords: { lat: formData.lat, lon: formData.lon }
			};
			onSubmit(locationData);
		}
		
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

	return (
		<div className="location-form">
			<div className="location-form__header">
				<h3>{mode === 'create' ? 'Створити локацію' : 'Редагувати локацію'}</h3>
			</div>
			
			{validationErrors.length > 0 && (
				<div className="location-form__errors">
					{validationErrors.map((error, index) => (
						<p key={index} className="location-form__error">{error}</p>
					))}
				</div>
			)}
			
			<form className="location-form__form" onSubmit={handleSubmit}>
				<div className="location-form__field">
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

				<div className="location-form__field">
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

				<div className="location-form__field">
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

				<div className="location-form__field">
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

				<div className="location-form__field">
					<label htmlFor="description">Опис</label>
					<textarea
						id="description"
						name="description"
						value={formData.description}
						onChange={handleInputChange}
						rows={3}
					/>
				</div>
				
				<div className="location-form__coordinates-hint">
					<p>💡 Підказка: Клікніть на карту для автоматичного заповнення координат або введіть їх в межах доступної області Києва</p>
				</div>

				<div className="location-form__actions">
					<button type="button" className="location-form__btn location-form__btn--secondary" onClick={onCancel}>
						Скасувати
					</button>
					<button type="submit" className="location-form__btn location-form__btn--primary">
						{mode === 'create' ? 'Створити' : 'Зберегти'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default LocationForm;