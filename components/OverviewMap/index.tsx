import { Button, Space, Text, Title } from "@mantine/core";
import Link from "next/link";

import { getFiveLeastVisitedLocations, getLastVisit, getLastVisitedDay, getSixMonthsNotVisitedLocations } from "@/lib/visitLib";
import { getPastEvents, getUpcomingEvents } from "@/lib/eventLib";

import { pinBlueIcon, pinBlueHighlightedIcon, pinGreenIcon, pinGreyIcon, pinPinkIcon, pinRedIcon, pinYellowIcon } from "@/lib/iconLib";

import { IconListDetails } from "@tabler/icons-react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface OverviewMapProps {
  locations: Location[];
  events: Event[];
  isMobile: boolean;
}

const OverviewMap: React.FC<OverviewMapProps> = ({ locations, events, isMobile }) => {
  const fiveLeastVisitedLocations = getFiveLeastVisitedLocations(locations, events);
  const sixMonthsNotVisitedLocations = getSixMonthsNotVisitedLocations(locations, events);

  return (
    <MapContainer
      center={[51.51360649415908, 7.46530746959316]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: `${isMobile ? "50vh" : "60vh"}`, width: "100%", zIndex: 10 }}
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
              location.noGo
                ? pinGreyIcon
                : !getLastVisit(location.id, events)
                ? pinPinkIcon
                : !location.indoor && location.outdoor
                ? pinGreenIcon
                : fiveLeastVisitedLocations.includes(location.id) && sixMonthsNotVisitedLocations.includes(location.id)
                ? pinRedIcon
                : sixMonthsNotVisitedLocations.includes(location.id)
                ? pinYellowIcon
                : [...getUpcomingEvents(events), ...getPastEvents(events)].slice(0, 3).find((event) => event.locationId === location.id)
                ? pinBlueHighlightedIcon
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
};

export default OverviewMap;
