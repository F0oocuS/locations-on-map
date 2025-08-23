import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import Location from '../../core/interfaces/Location.tsx';

interface MapProps {
	locations: Location[];
	onLocationClick: (location: Location) => void;
}

function Map({ locations, onLocationClick }: MapProps): React.ReactElement {
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
				maxZoom={15}
			/>

			{locations.map((location) => (
				<Marker 
					key={location.id}
					position={[location.coords.lat, location.coords.lon]} 
					icon={customIcon}
					eventHandlers={{
						click: () => onLocationClick(location)
					}}
				>
					<Popup>
						<div>
							<h3>{location.name}</h3>
							<p><strong>Категорія:</strong> {location.category}</p>
							{location.description && <p>{location.description}</p>}
							<button 
								onClick={() => onLocationClick(location)}
								style={{
									marginTop: '10px',
									padding: '5px 10px',
									backgroundColor: '#007bff',
									color: 'white',
									border: 'none',
									borderRadius: '4px',
									cursor: 'pointer'
								}}
							>
								Детальніше
							</button>
						</div>
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}

export default Map;