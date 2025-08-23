import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import Location from '../../core/interfaces/Location.tsx';

interface MapControllerProps {
	selectedLocation: Location | null;
}

function MapController({ selectedLocation }: MapControllerProps) {
	const map = useMap();

	useEffect(() => {
		if (selectedLocation) {
			// Центруємо карту на вибраній локації з анімацією
			map.flyTo(
				[selectedLocation.coords.lat, selectedLocation.coords.lon], 
				16, // зум рівень для детального перегляду
				{
					animate: true,
					duration: .5,
					easeLinearity: 0.1
				}
			);
		}
	}, [selectedLocation, map]);

	return null;
}

export default MapController;