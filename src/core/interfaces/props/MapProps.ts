import Location from '../Location';
import Coordinate from '../Coordinate';

export interface MapProps {
	locations: Location[];
	onLocationClick: (location: Location) => void;
	centerMapLocation: Location | null;
	onMapClick?: (coordinates?: Coordinate) => void;
	onExportGeoJSON?: () => void;
	onImportGeoJSON?: () => void;
	mapCenter?: [number, number];
	mapZoom?: number;
	onMapMove?: (center: [number, number], zoom: number) => void;
}