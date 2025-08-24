import React from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './Map.scss';

import MapController from './MapController.tsx';
import MapClickHandler from './MapClickHandler.tsx';
import MapMoveHandler from './MapMoveHandler.tsx';
import { MapService } from '../../core/services/map.service';

import Location from '../../core/interfaces/Location.tsx';
import Coordinate from '../../core/interfaces/Coordinate.tsx';
import { MapProps } from '../../core/interfaces/props/MapProps';

function Map({ locations, onLocationClick, centerMapLocation, onMapClick, onExportGeoJSON, onImportGeoJSON, mapCenter = MapService.DEFAULT_CENTER, mapZoom = MapService.DEFAULT_ZOOM, onMapMove }: MapProps): React.ReactElement {
	const customIcon = MapService.createCustomIcon();
	const mapContainerConfig = MapService.getMapContainerConfig(mapCenter, mapZoom);

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
				center={mapContainerConfig.center}
				zoom={mapContainerConfig.zoom}
				maxBounds={mapContainerConfig.maxBounds}
				maxBoundsViscosity={mapContainerConfig.maxBoundsViscosity}
				style={mapContainerConfig.style}
			>
				<TileLayer
					url={MapService.TILE_LAYER_CONFIG.url}
					minZoom={MapService.TILE_LAYER_CONFIG.minZoom}
					maxZoom={MapService.TILE_LAYER_CONFIG.maxZoom}
				/>

				<MapController selectedLocation={centerMapLocation} />
				{onMapClick && <MapClickHandler onMapClick={onMapClick} />}
				{onMapMove && <MapMoveHandler onMapMove={onMapMove} />}

				<MarkerClusterGroup
					chunkedLoading
					maxClusterRadius={MapService.CLUSTER_CONFIG.maxClusterRadius}
					spiderfyOnMaxZoom={MapService.CLUSTER_CONFIG.spiderfyOnMaxZoom}
					showCoverageOnHover={MapService.CLUSTER_CONFIG.showCoverageOnHover}
					zoomToBoundsOnClick={MapService.CLUSTER_CONFIG.zoomToBoundsOnClick}
					disableClusteringAtZoom={MapService.CLUSTER_CONFIG.disableClusteringAtZoom}
					iconCreateFunction={MapService.createClusterIcon}
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