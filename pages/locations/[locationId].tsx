import { useState } from "react";

import { Container, Flex, Tabs, Text, Title } from "@mantine/core";
import { IconInfoCircle, IconMap2, IconPhoto, IconSettings } from "@tabler/icons-react";

import LocationDetailsBasics from "@/components/LocationDetails/LocationDetailsBasics";

import { getAverageVisitors, getLastVisitedDay } from "@/lib/visitLib";

import { getAllEventsFromDb } from "@/services/eventService";
import { getLocationByIdFromDb } from "@/services/locationService";

export async function getServerSideProps(context: any) {
  const locationId = context.params.locationId;

  try {
    const locationData = await getLocationByIdFromDb(locationId);
    const eventData = await getAllEventsFromDb();
    const averageVisitors = getAverageVisitors(locationId, eventData);
    const lastVisit = getLastVisitedDay(locationId, eventData);

    return {
      props: {
        locationId,
        locationData,
        averageVisitors,
        lastVisit,
      },
    };
  } catch (e) {
    return { redirect: { destination: "/404", permanent: false } };
  }
}

export default function LocationDetails({
  locationId,
  locationData,
  averageVisitors,
  lastVisit,
}: {
  locationId: string;
  locationData: Location;
  averageVisitors: number;
  lastVisit: string;
}) {
  const [location, setLocation] = useState(locationData ?? {});
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Container
        h={"20vh"}
        fluid
        p={0}
        style={{
          backgroundImage: `url(${location?.images[0]?.url})`,
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
      <Tabs defaultValue="basics" color="teal">
        <Tabs.List grow>
          <Tabs.Tab value="basics" icon={<IconInfoCircle size="0.8rem" />}>
            Basics
          </Tabs.Tab>
          <Tabs.Tab value="gallery" icon={<IconPhoto size="0.8rem" />}>
            Galerie
          </Tabs.Tab>
          <Tabs.Tab value="map" icon={<IconMap2 size="0.8rem" />}>
            Karte
          </Tabs.Tab>
          <Tabs.Tab value="settings" icon={<IconSettings size="0.8rem" />}>
            Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="basics" pt="xs">
          <LocationDetailsBasics
            location={location}
            averageVisitors={averageVisitors}
            lastVisit={lastVisit}
          />
        </Tabs.Panel>

        <Tabs.Panel value="gallery" pt="xs">
          Galerie
        </Tabs.Panel>

        <Tabs.Panel value="map" pt="xs">
          Karte
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="xs">
          Einstellungen
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
