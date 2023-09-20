import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import PinBlueImg from "../../../assets/icons/pin-blue.png";

export interface LocationDetailsMapProps {
  latitude: number;
  longitude: number;
  isMobile: boolean;
}

const LocationDetailsMap: React.FC<LocationDetailsMapProps> = ({ latitude, longitude, isMobile }) => {
  const pinBlueIcon = L.icon({
    iconUrl: PinBlueImg.src,
    iconRetinaUrl: PinBlueImg.src,
    iconSize: [24, 35],
    iconAnchor: [12, 35],
  });

  const position: LatLngTuple = [latitude, longitude];

  return (
    <MapContainer
      center={position}
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
};

export default LocationDetailsMap;
