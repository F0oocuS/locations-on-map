import Coordinate from '../Coordinate';

export interface MapClickHandlerProps {
	onMapClick: (coordinates?: Coordinate) => void;
}