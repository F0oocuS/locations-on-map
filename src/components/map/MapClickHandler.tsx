import { useMapEvents } from 'react-leaflet';
import Coordinate from '../../core/interfaces/Coordinate.tsx';
import { MapClickHandlerProps } from '../../core/interfaces/props/MapClickHandlerProps';

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
	useMapEvents({
		click: (event) => {
			const coordinates: Coordinate = {
				lat: event.latlng.lat,
				lon: event.latlng.lng
			};
			onMapClick(coordinates);
		},
	});

	return null;
}

export default MapClickHandler;