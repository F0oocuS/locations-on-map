import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import MapController from './MapController.tsx';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './Map.scss';
import Location from '../../core/interfaces/Location.tsx';

interface MapProps {
	locations: Location[];
	onLocationClick: (location: Location) => void;
	centerMapLocation: Location | null;
}

function Map({ locations, onLocationClick, centerMapLocation }: MapProps): React.ReactElement {
	const center: number[] = [50.4501, 30.5234];
	const cityBounds: L.LatLngBoundsExpression = [
		[50.2133, 30.2394],
		[50.5900, 30.8250]
	];
	const customIcon = new L.Icon({
		iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
		shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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
		<MapContainer
			center={center} // центр Києва
			zoom={12}
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
	);
}

export default Map;