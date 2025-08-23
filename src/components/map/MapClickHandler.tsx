import { useMapEvents } from 'react-leaflet';

interface MapClickHandlerProps {
	onMapClick: () => void;
}

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
	useMapEvents({
		click: () => {
			onMapClick();
		},
	});

	return null;
}

export default MapClickHandler;