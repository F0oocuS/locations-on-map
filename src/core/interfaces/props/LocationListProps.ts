import Location from '../Location';

export interface LocationListProps {
	locations: Location[];
	onLocationClick: (location: Location) => void;
}
