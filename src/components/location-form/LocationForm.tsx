import React, { useState, useEffect } from 'react';
import { MapService } from '../../core/services/map.service';
import { LocationFormProps } from '../../core/interfaces/props/LocationFormProps';
import { ValidationService } from '../../core/services/validation.service';
import './LocationForm.scss';

const LocationForm: React.FC<LocationFormProps> = ({ mode, location, mapClickCoordinates, onSubmit, onCancel }) => {
	const [formData, setFormData] = useState({
		name: '',
		category: 'other' as 'food' | 'park' | 'museum' | 'shop' | 'other',
		description: '',
		lat: 0,
		lon: 0,
	});
	const [validationErrors, setValidationErrors] = useState<string[]>([]);

	useEffect(() => {
		if ((mode === 'create' || mode === 'edit') && mapClickCoordinates) {
			setFormData((prev) => ({
				...prev,
				lat: mapClickCoordinates.lat,
				lon: mapClickCoordinates.lon,
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
				lon: location.coords.lon,
			});
			setValidationErrors([]);
		} else if (mode === 'create') {
			resetForm();
		}
	}, [mode, location]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		const newValue = name === 'lat' || name === 'lon' ? parseFloat(value) || 0 : value;

		setFormData((prev) => ({
			...prev,
			[name]: newValue,
		}));

		setValidationErrors([]);
	};

	const validateForm = (): boolean => {
		const errors = ValidationService.validateLocationForm(formData.name, formData.lat, formData.lon);
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
				coords: { lat: formData.lat, lon: formData.lon },
			};
			onSubmit(locationData);
		} else if (mode === 'edit' && location) {
			const locationData = {
				id: location.id,
				name: formData.name,
				category: formData.category,
				description: formData.description,
				createdAt: location.createdAt,
				coords: { lat: formData.lat, lon: formData.lon },
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
			lon: 0,
		});

		setValidationErrors([]);
	};

	return (
		<div className="location-form">
			<div className="location-form__header">{mode === 'create' ? 'Створити локацію' : 'Редагувати локацію'}</div>

			{validationErrors.length > 0 && (
				<div className="location-form__errors">
					{validationErrors.map((error, index) => (
						<p key={index} className="location-form__error">
							{error}
						</p>
					))}
				</div>
			)}

			<form className="location-form__form" onSubmit={handleSubmit}>
				<div className="location-form__field">
					<label className="location-form__label" htmlFor="name">
						Назва*
					</label>
					<input id="name" name="name" className="location-form__input" type="text" value={formData.name} onChange={handleInputChange} required />
				</div>

				<div className="location-form__field">
					<label className="location-form__label" htmlFor="category">
						Категорія*
					</label>
					<select id="category" name="category" className="location-form__input" value={formData.category} onChange={handleInputChange} required>
						<option value="food">Їжа</option>
						<option value="park">Парк</option>
						<option value="museum">Музей</option>
						<option value="shop">Магазин</option>
						<option value="other">Інше</option>
					</select>
				</div>

				<div className="location-form__field">
					<label className="location-form__label" htmlFor="lat">
						Широта*
					</label>
					<input
						id="lat"
						name="lat"
						className="location-form__input"
						type="number"
						step="any"
						value={formData.lat}
						onChange={handleInputChange}
						min={MapService.MAP_BOUNDS.minLat}
						max={MapService.MAP_BOUNDS.maxLat}
						placeholder={`${MapService.MAP_BOUNDS.minLat} - ${MapService.MAP_BOUNDS.maxLat}`}
						required
					/>
				</div>

				<div className="location-form__field">
					<label className="location-form__label" htmlFor="lon">
						Довгота*
					</label>
					<input
						id="lon"
						name="lon"
						className="location-form__input"
						type="number"
						step="any"
						value={formData.lon}
						onChange={handleInputChange}
						min={MapService.MAP_BOUNDS.minLon}
						max={MapService.MAP_BOUNDS.maxLon}
						placeholder={`${MapService.MAP_BOUNDS.minLon} - ${MapService.MAP_BOUNDS.maxLon}`}
						required
					/>
				</div>

				<div className="location-form__field">
					<label className="location-form__label" htmlFor="description">
						Опис
					</label>
					<textarea id="description" name="description" className="location-form__input" value={formData.description} onChange={handleInputChange} rows={3} />
				</div>

				<div className="location-form__coordinates-hint">Підказка: Клікніть на карту для автоматичного заповнення координат або введіть їх в межах доступної області Києва</div>

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
