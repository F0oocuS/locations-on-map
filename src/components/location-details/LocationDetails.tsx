import React, { useEffect, useRef } from 'react';
import Location from '../../core/interfaces/Location.tsx';
import { LocationDetailsProps } from '../../core/interfaces/props/LocationDetailsProps';
import './LocationDetails.scss';

function LocationDetails({ location, onClose, onEdit, onDelete }: LocationDetailsProps): React.ReactElement | null {
	const detailsRef = useRef<HTMLDivElement>(null);


	if (!location) return null;

	const getCategoryName = (category: string): string => {
		switch (category) {
			case 'food': return 'Їжа';
			case 'park': return 'Парк';
			case 'museum': return 'Музей';
			case 'shop': return 'Магазин';
			default: return 'Інше';
		}
	};

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString('uk-UA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	return (
		<div className="location-details">
			<div className="location-details__content" ref={detailsRef}>
				<button 
					className="location-details__close" 
					onClick={onClose}
					aria-label="Закрити"
				>
					×
				</button>

				<div className="location-details__header">
					<h3 className="location-details__name">{location.name}</h3>

					<span className="location-details__category">
						{getCategoryName(location.category)}
					</span>
				</div>

				<div className="location-details__body">
					{location.description && (
						<p className="location-details__description">
							{location.description}
						</p>
					)}

					<div className="location-details__info">
						<div className="location-details__coordinates">
							<strong>Координати:</strong>
							<span>{location.coords.lat.toFixed(4)}, {location.coords.lon.toFixed(4)}</span>
						</div>

						<div className="location-details__date">
							<strong>Додано:</strong>
							<span>{formatDate(location.createdAt)}</span>
						</div>
					</div>

					<div className="location-details__actions">
						<button 
							className="location-details__btn location-details__btn--edit"
							onClick={() => onEdit(location)}
						>
							Редагувати
						</button>
						<button 
							className="location-details__btn location-details__btn--delete"
							onClick={() => onDelete(location)}
						>
							Видалити
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LocationDetails;