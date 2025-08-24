
import L from 'leaflet';

export class MapService {
	// Константи для карти
	static readonly DEFAULT_CENTER: [number, number] = [50.4501, 30.5234];
	static readonly DEFAULT_ZOOM = 12;
	static readonly CITY_BOUNDS: L.LatLngBoundsExpression = [
		[50.2133, 30.2394],
		[50.5900, 30.8250]
	];

	// Налаштування тайлів
	static readonly TILE_LAYER_CONFIG = {
		url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		minZoom: 10,
		maxZoom: 16
	};

	// Налаштування кластерів
	static readonly CLUSTER_CONFIG = {
		maxClusterRadius: 80,
		spiderfyOnMaxZoom: true,
		showCoverageOnHover: false,
		zoomToBoundsOnClick: true,
		disableClusteringAtZoom: 16
	};

	// Створення кастомної іконки маркера
	static createCustomIcon(): L.Icon {
		return new L.Icon({
			iconUrl: "src/assets/image/marker-icon.png",
			shadowUrl: "src/assets/image/marker-shadow.png",
			iconSize: [25, 41],
			iconAnchor: [12, 41],
		});
	}

	// Визначення розміру кластера за кількістю
	static getClusterSize(count: number): string {
		if (count < 10) {
			return 'small';
		} else if (count < 100) {
			return 'medium';
		} else {
			return 'large';
		}
	}

	// Створення кастомної іконки кластера
	static createClusterIcon(cluster: L.MarkerCluster): L.DivIcon {
		const count = cluster.getChildCount();
		const size = MapService.getClusterSize(count);

		return L.divIcon({
			html: `<div><span>${count}</span></div>`,
			className: `custom-marker-cluster custom-marker-cluster-${size}`,
			iconSize: L.point(40, 40, true),
		});
	}

	// Налаштування контейнера карти
	static getMapContainerConfig(mapCenter: [number, number], mapZoom: number) {
		return {
			center: mapCenter,
			zoom: mapZoom,
			maxBounds: MapService.CITY_BOUNDS,
			maxBoundsViscosity: 1.0,
			style: { height: "100vh", width: "100%" }
		};
	}

	// Анімація переходу до локації
	static flyToLocation(map: L.Map, location: { lat: number; lon: number }, zoom = 16) {
		map.flyTo(
			[location.lat, location.lon], 
			zoom,
			{
				animate: true,
				duration: 0.5,
				easeLinearity: 0.1
			}
		);
	}
}
