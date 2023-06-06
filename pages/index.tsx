import EventCardCompact from "@/components/EventCardCompact";
import { getPastEvents, getUpcomingEvents } from "@/lib/eventLib";
import { getAllEventsFromDb } from "@/services/eventService";
import { getAllLocationsFromDb } from "@/services/locationService";

import { Title, Container, Stack, Grid, Space, Text } from "@mantine/core";

import dynamic from "next/dynamic";
const OverviewMap = dynamic((): any => import("@/components/OverviewMap"), {
  ssr: false,
});

export async function getServerSideProps() {
  try {
    const [locations, events] = await Promise.all([getAllLocationsFromDb(), getAllEventsFromDb()]);

    return {
      props: {
        locations,
        events,
      },
    };
  } catch (error) {
    console.error(error);
  }
}

export default function Home({ locations, events }: { locations: Location[]; events: Event[] }) {
  const lastFiveEvents = getPastEvents(events).slice(0, 5);
  const nextFiveEvents = getUpcomingEvents(events).slice(0, 5);

  return (
    <Container fluid px={"xl"} py={"xs"}>
      <Grid grow style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <Grid.Col span={6}>
          <Stack spacing={0}>
            <Title order={2} size={18}>
              Bevorstehend
            </Title>

            {nextFiveEvents.length > 0 ? (
              nextFiveEvents.map((event: Event) => (
                <EventCardCompact
                  key={event.id}
                  event={event}
                  location={locations.find((location) => location.id === event.locationId)}
                />
              ))
            ) : (
              <Text c={"dimmed"} fs={"italic"} size={"sm"}>
                Keine bevorstehenden Events
              </Text>
            )}
          </Stack>
        </Grid.Col>

        <Grid.Col span={6}>
          <Stack spacing={0}>
            <Title order={2} size={"h4"}>
              Vergangen
            </Title>
            {lastFiveEvents.length > 0 ? (
              lastFiveEvents.map((event: Event) => (
                <EventCardCompact
                  key={event.id}
                  event={event}
                  location={locations.find((location) => location.id === event.locationId)}
                />
              ))
            ) : (
              <Text c={"dimmed"} fs={"italic"} size={"sm"}>
                Keine vergangenen Events
              </Text>
            )}
          </Stack>
        </Grid.Col>
      </Grid>

      <Space h={"lg"} />

      <OverviewMap
        // @ts-ignore
        locations={locations}
        events={events}
      />
    </Container>
  );
}
