import Coordinate from './Coordinate.tsx';

export default interface Location {
	id: string;
	name: string;
	category: 'food' | 'park' | 'museum' | 'shop' | 'other';
	description?: string;
	createdAt: string;
	coords: Coordinate;
}
