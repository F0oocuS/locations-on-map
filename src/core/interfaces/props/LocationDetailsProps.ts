import Location from '../Location';

export interface LocationDetailsProps {
	location: Location | null;
	onClose: () => void;
	onEdit: (location: Location) => void;
	onDelete: (location: Location) => void;
}
