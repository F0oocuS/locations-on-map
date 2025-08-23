import { useMapEvents } from 'react-leaflet';
import Coordinate from '../../core/interfaces/Coordinate.tsx';

interface MapClickHandlerProps {
	onMapClick: (coordinates?: Coordinate) => void;
}

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