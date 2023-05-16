import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

export default function LocationDetailsMap({
  latitude,
  longitude,
  isMobile,
}: {
  latitude: number;
  longitude: number;
  isMobile: boolean;
}) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: `${isMobile ? "50vh" : "60vh"}`, width: "100vw" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={{ lat: latitude, lng: longitude }} />
    </MapContainer>
  );
}
