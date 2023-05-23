import { Button, Space, Text, Title } from "@mantine/core";
import Link from "next/link";

import {
  getFiveLeastVisitedLocations,
  getLastVisitedDay,
  getSixMonthsNotVisitedLocations,
} from "@/lib/visitLib";

import { IconListDetails } from "@tabler/icons-react";

import PinBlueImg from "../../assets/icons/pin-blue.png";
import PinYellowImg from "../../assets/icons/pin-yellow.png";
import PinRedImg from "../../assets/icons/pin-red.png";
import PinGreyImg from "../../assets/icons/pin-grey.png";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

export default function OverviewMap({
  locations,
  events,
  isMobile,
}: {
  locations: Location[];
  events: Event[];
  isMobile: boolean;
}) {
  const pinBlueIcon = L.icon({
    iconUrl: PinBlueImg.src,
    iconRetinaUrl: PinBlueImg.src,
    iconSize: [24, 35],
    iconAnchor: [12, 35],
  });

  const pinYellowIcon = L.icon({
    iconUrl: PinYellowImg.src,
    iconRetinaUrl: PinYellowImg.src,
    iconSize: [24, 35],
    iconAnchor: [12, 35],
  });

  const pinRedIcon = L.icon({
    iconUrl: PinRedImg.src,
    iconRetinaUrl: PinRedImg.src,
    iconSize: [24, 35],
    iconAnchor: [12, 35],
  });

  const pinGreyIcon = L.icon({
    iconUrl: PinGreyImg.src,
    iconRetinaUrl: PinGreyImg.src,
    iconSize: [24, 35],
    iconAnchor: [12, 35],
  });

  const fiveLeastVisitedLocations = getFiveLeastVisitedLocations(locations, events);
  const sixMonthsNotVisitedLocations = getSixMonthsNotVisitedLocations(locations, events);

  return (
    <MapContainer
      center={[51.51360649415908, 7.46530746959316]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: `${isMobile ? "50vh" : "60vh"}`, width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations?.map((location: any) => {
        return (
          <Marker
            key={location.id}
            position={{ lat: Number(location.latitude), lng: Number(location.longitude) }}
            icon={
              fiveLeastVisitedLocations.includes(location.id)
                ? pinRedIcon
                : sixMonthsNotVisitedLocations.includes(location.id)
                ? pinYellowIcon
                : location.noGo
                ? pinGreyIcon
                : pinBlueIcon
            }
          >
            <Popup>
              <Title order={3} size={14}>
                {location.name}
              </Title>
              <Text>Letzter Besuch: {getLastVisitedDay(location.id, events)}</Text>
              <Space h={"md"} />
              <Link href={`/locations/${location.id}`}>
                <Button leftIcon={<IconListDetails size={"1rem"} />} size={"xs"} w={"100%"}>
                  Location anzeigen
                </Button>
              </Link>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
