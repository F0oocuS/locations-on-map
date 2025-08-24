import Location from '../Location';
import Coordinate from '../Coordinate';

export interface LocationFormProps {
	mode: 'create' | 'edit';
	location?: Location | null;
	mapClickCoordinates?: Coordinate | null;
	onSubmit: (locationData: Omit<Location, 'id'> | Location) => void;
	onCancel: () => void;
}