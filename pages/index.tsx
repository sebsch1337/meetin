import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { signOut, useSession } from "next-auth/react";

import { getPastEvents, getUpcomingEvents } from "@/lib/eventLib";
import { getAllEventsFromDb } from "@/services/eventService";
import { getAllLocationsFromDb } from "@/services/locationService";

import { Title, Container, Stack, Grid, Space, Text } from "@mantine/core";

import { EventCardCompact } from "@/components/EventCardCompact";
import { WelcomeModal } from "@/components/WelcomeModal";

import dynamic from "next/dynamic";
import { getTeamByInvitedEmailFromDb } from "@/services/teamService";
import { useState } from "react";
import { GetServerSidePropsContext } from "next";

const OverviewMap = dynamic((): any => import("@/components/OverviewMap"), {
  ssr: false,
});

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/login", permanent: false } };

  const [locations, events] = session?.user?.teamId
    ? await Promise.all([getAllLocationsFromDb(session?.user?.teamId), getAllEventsFromDb(session?.user?.teamId)])
    : [[], []];

  const invitedTeam = !session?.user?.teamId && session?.user?.email ? await getTeamByInvitedEmailFromDb(session?.user?.email) : null;
  const showWelcome = !session?.user?.teamId;

  return {
    props: {
      locations,
      events,
      invitedTeam,
      showWelcome,
    },
  };
};

interface HomeProps {
  locations: Location[];
  events: Event[];
  invitedTeam: Team;
  showWelcome: boolean;
}

const Home: React.FC<HomeProps> = ({ locations, events, invitedTeam, showWelcome }) => {
  const { data: session } = useSession();

  const [showWelcomeModal, setShowWelcomeModal] = useState(showWelcome);

  const lastFiveEvents = getPastEvents(events).slice(0, 5);
  const nextFiveEvents = getUpcomingEvents(events).slice(0, 5);

  return (
    <>
      {showWelcomeModal ? (
        <WelcomeModal session={session} invitedTeam={invitedTeam} signOut={signOut} setShowWelcomeModal={setShowWelcomeModal} />
      ) : (
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
                      location={locations?.find((location) => location.id === event.locationId)}
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
      )}
    </>
  );
};

export default Home;
