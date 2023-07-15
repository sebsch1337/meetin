import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";

import { getPastEvents, getUpcomingEvents } from "@/lib/eventLib";
import { getAllEventsFromDb } from "@/services/eventService";
import { getAllLocationsFromDb } from "@/services/locationService";

import { Title, Container, Stack, Grid, Space, Text } from "@mantine/core";

import EventCardCompact from "@/components/EventCardCompact";
import WelcomeModal from "@/components/WelcomeModal";

import dynamic from "next/dynamic";
import { getAllTeamsFromDb } from "@/services/teamService";
const OverviewMap = dynamic((): any => import("@/components/OverviewMap"), {
  ssr: false,
});

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/login", permanent: false } };

  try {
    const [locations, events, teams] = await Promise.all([
      getAllLocationsFromDb(),
      getAllEventsFromDb(),
      getAllTeamsFromDb(),
    ]);

    return {
      props: {
        locations,
        events,
        teams,
      },
    };
  } catch (error) {
    console.error(error);
  }
}

export default function Home({
  locations,
  events,
  teams,
}: {
  locations: Location[];
  events: Event[];
  teams: Team[];
}) {
  const { data: session } = useSession();

  const lastFiveEvents = getPastEvents(events).slice(0, 5);
  const nextFiveEvents = getUpcomingEvents(events).slice(0, 5);

  return (
    <Container fluid px={"xl"} py={"xs"}>
      {
        //@ts-ignore
        !session?.user?.team ? (
          <WelcomeModal session={session} teams={teams} />
        ) : (
          <>
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
          </>
        )
      }
    </Container>
  );
}
