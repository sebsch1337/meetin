import { useEffect, useState } from "react";

import { Container, Flex, LoadingOverlay, Tabs, Text, Title } from "@mantine/core";
import { IconHistory, IconInfoCircle, IconMap2, IconPhoto, IconSettings } from "@tabler/icons-react";

import LocationDetailsBasics from "@/components/LocationDetails/LocationDetailsBasics";

import { getAverageVisitors, getEventsByLocationId, getLastVisitedDay } from "@/lib/visitLib";

import { getAllEventsByLocationIdFromDb, getAllEventsFromDb } from "@/services/eventService";
import { getLocationByIdFromDb } from "@/services/locationService";
import { LocationDetailsPictures } from "@/components/LocationDetails/LocationDetailsPictures";
import { useMediaQuery } from "@mantine/hooks";

import dynamic from "next/dynamic";
import LocationDetailsHistory from "@/components/LocationDetails/LocationDetailsHistory";
const LocationDetailsMap = dynamic((): any => import("@/components/LocationDetails/LocationDetailsMap"), {
  ssr: false,
});

export async function getServerSideProps(context: any) {
  const locationId = context.params.locationId;

  const [locationData, locationEvents] = await Promise.all([
    getLocationByIdFromDb(locationId),
    getAllEventsByLocationIdFromDb(locationId),
  ]);

  if (locationData.id) {
    const averageVisitors = getAverageVisitors(locationId, locationEvents);
    const lastVisit = getLastVisitedDay(locationId, locationEvents);

    return {
      props: {
        locationId,
        averageVisitors,
        lastVisit,
        locationEvents,
        locationData,
      },
    };
  } else {
    return { redirect: { destination: "/404", permanent: false } };
  }
}

export default function LocationDetails({
  locationData,
  locationEvents,
  lastVisit,
  averageVisitors,
}: {
  locationData: Location;
  locationEvents: Event[];
  lastVisit: string;
  averageVisitors: number;
}): JSX.Element {
  const [location, setLocation] = useState<Location>(locationData ?? {});
  const [events, setEvents] = useState(locationEvents ?? []);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>("infos");
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Container
        h={"20vh"}
        fluid
        p={0}
        style={{
          backgroundImage: `url(${location?.images?.length > 0 ? location.images[0]?.url : ""})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          objectFit: "cover",
        }}
      >
        <Flex
          w={"100%"}
          h={"100%"}
          justify={"center"}
          align={"center"}
          direction={"column"}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <Title order={1} color={"white"} style={{ textShadow: "0px 0px 4px #000000" }}>
            {location.name}
          </Title>
          <Text size={20} color={"white"} style={{ textShadow: "0px 0px 4px #000000" }}>
            {location?.address?.suburb}
          </Text>
        </Flex>
      </Container>
      <Tabs defaultValue="infos" color="teal" value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List grow>
          <Tabs.Tab value="infos" icon={<IconInfoCircle size="0.8rem" />}>
            Infos
          </Tabs.Tab>
          <Tabs.Tab value="gallery" icon={<IconPhoto size="0.8rem" />}>
            Galerie
          </Tabs.Tab>
          <Tabs.Tab value="map" icon={<IconMap2 size="0.8rem" />}>
            Karte
          </Tabs.Tab>
          <Tabs.Tab value="history" icon={<IconHistory size="0.8rem" />}>
            Verlauf
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="infos" pt="xs">
          {activeTab === "infos" && (
            <LocationDetailsBasics
              location={location}
              averageVisitors={averageVisitors}
              lastVisit={lastVisit}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="gallery" pt="xs">
          {activeTab === "gallery" && (
            <LocationDetailsPictures
              location={location}
              setLoading={setLoading}
              setLocation={setLocation}
              isMobile={isMobile}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="map" pt="xs">
          {activeTab === "map" && (
            <LocationDetailsMap
              // @ts-ignore
              latitude={location?.latitude ?? 0}
              longitude={location?.longitude ?? 0}
              isMobile={isMobile}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="history" pt="xs">
          <LocationDetailsHistory locationEvents={events} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
