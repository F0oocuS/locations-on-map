import React from 'react';
import Location from '../../core/interfaces/Location.tsx';
import './LocationsList.scss';

interface LocationsListProps {
	locations: Location[];
	onLocationClick: (location: Location) => void;
}

function LocationsList({ locations, onLocationClick }: LocationsListProps): React.ReactElement {
	const getCategoryName = (category: string): string => {
		switch (category) {
			case 'food': return 'Їжа';
			case 'park': return 'Парк';
			case 'museum': return 'Музей';
			case 'shop': return 'Магазин';
			default: return 'Інше';
		}
	};

	return (
		<div className="locations-list">
			<div className="locations-list__header">
				<h2>Локації</h2>
				<span className="locations-list__count">{locations.length}</span>
			</div>
			
			<div className="locations-list__items">
				{locations.map((location) => (
					<div 
						key={location.id} 
						className="locations-list__item"
						onClick={() => onLocationClick(location)}
					>
						<div className="locations-list__item-content">
							<span className="locations-list__name">{location.name}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default LocationsList;