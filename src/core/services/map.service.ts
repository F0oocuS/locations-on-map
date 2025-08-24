import L from 'leaflet';

import markerIcon from '../../assets/image/marker-icon.png';
import markerShadow from '../../assets/image/marker-shadow.png';

export class MapService {
	static readonly MAP_BOUNDS = {
		minLat: 50.2133,
		maxLat: 50.59,
		minLon: 30.2394,
		maxLon: 30.825,
	};
	static readonly DEFAULT_CENTER: [number, number] = [50.4501, 30.5234];
	static readonly DEFAULT_ZOOM = 12;
	static readonly MIN_ZOOM = 10;
	static readonly MAX_ZOOM = 15;
	static readonly CITY_BOUNDS: L.LatLngBoundsExpression = [
		[MapService.MAP_BOUNDS.minLat, MapService.MAP_BOUNDS.minLon],
		[MapService.MAP_BOUNDS.maxLat, MapService.MAP_BOUNDS.maxLon],
	];
	static readonly TILE_LAYER_CONFIG = {
		url: './tiles/{z}/{x}/{y}.png',
		minZoom: MapService.MIN_ZOOM,
		maxZoom: MapService.MAX_ZOOM,
	};
	static readonly CLUSTER_CONFIG = {
		maxClusterRadius: 80,
		spiderfyOnMaxZoom: true,
		showCoverageOnHover: true,
		zoomToBoundsOnClick: true,
		disableClusteringAtZoom: MapService.MAX_ZOOM,
	};

	static createCustomIcon(): L.Icon {
		return new L.Icon({
			iconUrl: markerIcon,
			shadowUrl: markerShadow,
			iconSize: [25, 41],
			iconAnchor: [12, 41],
		});
	}

	static getClusterSize(count: number): string {
		if (count < 10) {
			return 'small';
		} else if (count < 100) {
			return 'medium';
		} else {
			return 'large';
		}
	}

	static createClusterIcon(cluster: L.MarkerCluster): L.DivIcon {
		const count = cluster.getChildCount();
		const size = MapService.getClusterSize(count);

		return L.divIcon({
			html: `<div><span>${count}</span></div>`,
			className: `custom-marker-cluster custom-marker-cluster-${size}`,
			iconSize: L.point(40, 40, true),
		});
	}

	static getMapContainerConfig(mapCenter: [number, number], mapZoom: number) {
		return {
			center: mapCenter,
			zoom: mapZoom,
			maxBounds: MapService.CITY_BOUNDS,
			maxBoundsViscosity: 1.0,
			style: { height: '100vh', width: '100%' },
		};
	}

	static flyToLocation(map: L.Map, location: { lat: number; lon: number }, zoom = MapService.MAX_ZOOM) {
		map.flyTo([location.lat, location.lon], zoom, {
			animate: true,
			duration: 0.5,
			easeLinearity: 0.1,
		});
	}

	static isCoordinatesInBounds(lat: number, lon: number): boolean {
		return lat >= MapService.MAP_BOUNDS.minLat && lat <= MapService.MAP_BOUNDS.maxLat && lon >= MapService.MAP_BOUNDS.minLon && lon <= MapService.MAP_BOUNDS.maxLon;
	}
}
