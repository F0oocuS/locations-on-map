import Location from '../Location';
import Coordinate from '../Coordinate';

export interface LocationManagerProps {
	selectedLocation: Location | null;
	onLocationUpdate: (location: Location) => void;
	onLocationDelete: (locationId: string) => void;
	onLocationCreate: (location: Omit<Location, 'id'>) => void;
	onClose: () => void;
	mapClickCoordinates: Coordinate | null;
	editMode: boolean;
}