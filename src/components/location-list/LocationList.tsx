import React from 'react';
import { LocationListProps } from '../../core/interfaces/props/LocationListProps';
import './LocationList.scss';

function LocationList({ locations, onLocationClick }: LocationListProps): React.ReactElement {
	return (
		<div className="location-list">
			<div className="location-list__items">
				{locations.length > 0 ? (
					locations.map((location) => (
						<div key={location.id} className="location-list__item" onClick={() => onLocationClick(location)}>
							<div className="location-list__item-content">
								<span className="location-list__name">{location.name}</span>
							</div>
						</div>
					))
				) : (
					<div className="location-list__empty">
						<p>Локацій не знайдено</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default LocationList;
