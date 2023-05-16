import { getPastEvents, getUpcomingEvents } from "@/lib/eventLib";
import { getAllEventsFromDb } from "@/services/eventService";
import { getAllLocationsFromDb } from "@/services/locationService";
import { getLocalDateLong, getLocalDateTimeLong, getLocalDateTimeShort } from "@/utils/date";

import { Title, Container, Group, Table, Stack, Grid, Space, Text } from "@mantine/core";

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
          <Stack spacing={"xs"}>
            <Title order={2} size={18}>
              Bevorstehende Events
            </Title>
            <Table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Event</th>
                </tr>
              </thead>
              <tbody>
                {events?.length > 0 ? (
                  getUpcomingEvents(events)
                    .slice(0, 5)
                    .map((event: Event) => (
                      <tr key={event.id}>
                        <td>{`${getLocalDateTimeShort(event.dateTime)}`}</td>
                        <td>
                          <Text>{event.name}</Text>
                          <Text size={"xs"}>
                            {locations.find((location: Location) => location.id === event.locationId)?.name}
                          </Text>
                        </td>
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
          <Stack spacing={"xs"}>
            <Title order={2} size={18}>
              Vergangene Events
            </Title>
            <Table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Event</th>
                </tr>
              </thead>
              <tbody>
                {events?.length > 0 ? (
                  getPastEvents(events)
                    .slice(0, 5)
                    .map((event: Event) => (
                      <tr key={event.id}>
                        <td>{`${getLocalDateTimeShort(event.dateTime)}`}</td>
                        <td>
                          <Text>{event.name}</Text>
                          <Text size={"xs"}>
                            {locations.find((location: Location) => location.id === event.locationId)?.name}
                          </Text>
                        </td>
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
