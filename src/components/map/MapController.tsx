import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { MapService } from '../../core/services/map.service';
import { MapControllerProps } from '../../core/interfaces/props/MapControllerProps';

function MapController({ selectedLocation }: MapControllerProps) {
	const map = useMap();

	useEffect(() => {
		if (selectedLocation) {
			MapService.flyToLocation(map, {
				lat: selectedLocation.coords.lat,
				lon: selectedLocation.coords.lon
			});
		}
	}, [selectedLocation, map]);

	return null;
}

export default MapController;