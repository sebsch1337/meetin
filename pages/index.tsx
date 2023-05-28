import EventCardCompact from "@/components/EventCardCompact";
import { getPastEvents, getUpcomingEvents } from "@/lib/eventLib";
import { getAllEventsFromDb } from "@/services/eventService";
import { getAllLocationsFromDb } from "@/services/locationService";

import { Title, Container, Table, Stack, Grid, Space, Card } from "@mantine/core";

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
  return (
    <Container fluid px={"xl"} py={"xs"}>
      <Grid grow>
        <Grid.Col xs={1}>
          <Stack spacing={0}>
            <Title order={2} size={18}>
              Bevorstehend
            </Title>

            <Table highlightOnHover>
              <tbody>
                {events?.length > 0 ? (
                  getUpcomingEvents(events)
                    .slice(0, 5)
                    .map((event: Event) => (
                      <tr key={event.id}>
                        <EventCardCompact
                          event={event}
                          location={locations.find((location) => location.id === event.locationId)}
                        />
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td>Keine Daten</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Stack>
        </Grid.Col>

        <Grid.Col xs={1}>
          <Stack spacing={0}>
            <Title order={2} size={"h4"}>
              Vergangen
            </Title>
            <Table highlightOnHover>
              <tbody>
                {events?.length > 0 ? (
                  getPastEvents(events)
                    .slice(0, 5)
                    .map((event: Event) => (
                      <tr key={event.id}>
                        <EventCardCompact
                          event={event}
                          location={locations.find((location) => location.id === event.locationId)}
                        />
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td>Keine Daten</td>
                  </tr>
                )}
              </tbody>
            </Table>
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
