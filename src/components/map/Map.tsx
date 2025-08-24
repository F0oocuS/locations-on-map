import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './Map.scss';

import MapController from './MapController.tsx';
import MapClickHandler from './MapClickHandler.tsx';
import MapMoveHandler from './MapMoveHandler.tsx';

import Location from '../../core/interfaces/Location.tsx';
import Coordinate from '../../core/interfaces/Coordinate.tsx';

interface MapProps {
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

function Map({ locations, onLocationClick, centerMapLocation, onMapClick, onExportGeoJSON, onImportGeoJSON, mapCenter = [50.4501, 30.5234], mapZoom = 12, onMapMove }: MapProps): React.ReactElement {
	const cityBounds: L.LatLngBoundsExpression = [
		[50.2133, 30.2394],
		[50.5900, 30.8250]
	];
	const customIcon = new L.Icon({
		iconUrl: "src/assets/image/marker-icon.png",
		shadowUrl: "src/assets/image/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
	});

	const createClusterCustomIcon = (cluster: L.MarkerCluster) => {
		const count = cluster.getChildCount();
		let size = 'small';
		
		if (count < 10) {
			size = 'small';
		} else if (count < 100) {
			size = 'medium';
		} else {
			size = 'large';
		}

		return L.divIcon({
			html: `<div><span>${count}</span></div>`,
			className: `custom-marker-cluster custom-marker-cluster-${size}`,
			iconSize: L.point(40, 40, true),
		});
	};

	return (
		<div className="map-wrapper">
			<div className="map__controls">
				{onExportGeoJSON && (
					<button 
						className="map__btn map__btn--export"
						onClick={onExportGeoJSON}
						title="Export GeoJSON"
					>
						Export GeoJSON
					</button>
				)}
				{onImportGeoJSON && (
					<button 
						className="map__btn map__btn--import"
						onClick={onImportGeoJSON}
						title="Import GeoJSON"
					>
						Import GeoJSON
					</button>
				)}
			</div>
			<MapContainer
				center={mapCenter} // центр Києва
				zoom={mapZoom}
				maxBounds={cityBounds}
				maxBoundsViscosity={1.0}
				style={{ height: "100vh", width: "100%" }}
			>
				<TileLayer
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					minZoom={10}
					maxZoom={16}
				/>

				<MapController selectedLocation={centerMapLocation} />
				{onMapClick && <MapClickHandler onMapClick={onMapClick} />}
				{onMapMove && <MapMoveHandler onMapMove={onMapMove} />}

				<MarkerClusterGroup
					chunkedLoading
					maxClusterRadius={80}
					spiderfyOnMaxZoom={true}
					showCoverageOnHover={false}
					zoomToBoundsOnClick={true}
					disableClusteringAtZoom={16}
					iconCreateFunction={createClusterCustomIcon}
				>
					{locations.map((location) => (
						<Marker 
							key={location.id}
							position={[location.coords.lat, location.coords.lon]} 
							icon={customIcon}
							eventHandlers={{
								click: () => onLocationClick(location)
							}}
						/>
					))}
				</MarkerClusterGroup>
			</MapContainer>
		</div>
	);
}

export default Map;