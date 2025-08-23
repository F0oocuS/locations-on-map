import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

function Map(): React.ReactElement {
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
	})
	return (
		<MapContainer
			center={center} // центр Києва
			zoom={12}
			baxBounds={cityBounds}
			maxBoundsViscosity={1.0}
			style={{ height: "100vh", width: "100%" }}
		>
			<TileLayer
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				minZoom={10}
				maxZoom={16}
				attribution="&copy; Local Tiles"
			/>

			<Marker position={center} icon={customIcon}>
				<Popup>Цент Києва!</Popup>
			</Marker>
		</MapContainer>
	);
}

export default Map;