import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import PinBlueImg from "../../../assets/icons/pin-blue.png";

export default function LocationDetailsMap({ latitude, longitude, isMobile }: { latitude: number; longitude: number; isMobile: boolean }) {
  const pinBlueIcon = L.icon({
    iconUrl: PinBlueImg.src,
    iconRetinaUrl: PinBlueImg.src,
    iconSize: [24, 35],
    iconAnchor: [12, 35],
  });

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: `${isMobile ? "50vh" : "60vh"}`, width: "100vw", zIndex: 1 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={{ lat: latitude, lng: longitude }} icon={pinBlueIcon} />
    </MapContainer>
  );
}
