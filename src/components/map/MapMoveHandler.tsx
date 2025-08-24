import { useMapEvents } from 'react-leaflet';
import { MapMoveHandlerProps } from '../../core/interfaces/props/MapMoveHandlerProps';

function MapMoveHandler({ onMapMove }: MapMoveHandlerProps) {
	useMapEvents({
		moveend: (e) => {
			const map = e.target;
			const center = map.getCenter();
			const zoom = map.getZoom();
			onMapMove([center.lat, center.lng], zoom);
		},
		zoomend: (e) => {
			const map = e.target;
			const center = map.getCenter();
			const zoom = map.getZoom();
			onMapMove([center.lat, center.lng], zoom);
		}
	});

	return null;
}

export default MapMoveHandler;