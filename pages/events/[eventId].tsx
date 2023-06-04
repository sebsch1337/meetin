import {
  ActionIcon,
  Container,
  Divider,
  Flex,
  Grid,
  LoadingOverlay,
  Stack,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { useEffect, useState } from "react";
import Link from "next/link";

import { getEventByIdFromDb } from "@/services/eventService";
import { getAllLocationsFromDb } from "@/services/locationService";

import { getLocalDateTimeLong } from "@/utils/date";

import { IconBrandFacebook, IconEdit } from "@tabler/icons-react";
import DetailsModal from "@/components/DetailsModal";
import { useDisclosure } from "@mantine/hooks";
import EventForm from "@/components/EventForm";
import DeleteModal from "@/components/DeleteModal";
import { deleteEvent } from "@/lib/eventLib";

export async function getServerSideProps(context: any) {
  const eventId = context.params.eventId;

  try {
    const eventData = await getEventByIdFromDb(eventId);
    const locationData = await getAllLocationsFromDb();

    return {
      props: {
        eventData,
        locationData,
      },
    };
  } catch (error) {
    console.error(error);
    return { redirect: { destination: "/404", permanent: false } };
  }
}

export default function EventDetails({
  eventData,
  locationData,
}: {
  eventData: Event;
  locationData: Location[];
}) {
  const [event, setEvent] = useState(eventData ?? {});
  const [location, setLocation] = useState<Location>();
  const [modal, setModal] = useState<Modal>({});
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  useEffect(() => {
    const location = locationData.find((location) => location.id === event?.locationId);
    setLocation(location);
  }, [event, locationData]);

  return (
    <>
      <DetailsModal opened={modalOpened} onClose={closeModal} modal={modal}>
        {modal.type === "form" && (
          <EventForm
            closeModal={closeModal}
            event={event}
            setEvent={setEvent}
            locations={locationData}
            modal={modal}
            setModal={setModal}
          />
        )}
        {modal.type === "delete" && (
          <DeleteModal
            type={"event"}
            deleteData={async () => await deleteEvent(event.id)}
            closeModal={closeModal}
          />
        )}
      </DetailsModal>

      <Container
        h={"20vh"}
        fluid
        p={0}
        style={{
          backgroundImage: `${location?.images?.length ? `url(${location?.images[0]?.url})` : "none"}`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          objectFit: "cover",
          position: "relative",
        }}
      >
        <ActionIcon
          variant={"light"}
          size={"md"}
          style={{ position: "absolute", top: rem(10), right: rem(10) }}
          onClick={() => {
            setModal({
              title: "Event bearbeiten",
              type: "form",
              editMode: true,
            });
            openModal();
          }}
        >
          <IconEdit size="1.5rem" />
        </ActionIcon>
        {event?.fbLink && (
          <ActionIcon
            component={Link}
            href={event?.fbLink ?? ""}
            target="_blank"
            variant={"light"}
            size={"md"}
            style={{ position: "absolute", bottom: rem(10), right: rem(10) }}
            onClick={() => {}}
          >
            <IconBrandFacebook size="1.5rem" />
          </ActionIcon>
        )}
        <Flex
          w={"100%"}
          h={"100%"}
          justify={"center"}
          align={"center"}
          direction={"column"}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <Text size={"sm"} color={"white"} style={{ textShadow: "0px 0px 4px #000000" }}>
            {getLocalDateTimeLong(event.dateTime)}
          </Text>
          <Title order={1} color={"white"} style={{ textShadow: "0px 0px 4px #000000" }}>
            {event.name}
          </Title>
          <Text size={"lg"} color={"white"} style={{ textShadow: "0px 0px 4px #000000" }}>
            {location?.name}
          </Text>
        </Flex>
      </Container>
      <Container fluid px={"xl"} py={"xs"}>
        <Grid grow>
          <Grid.Col xs={1}>
            <Stack spacing={0}>
              <Title order={2} size={18}>
                Details
              </Title>
              <Divider />
              <Grid grow mt={"xs"} gutter={"xs"}>
                <Grid.Col span={6}>
                  <Text size={"sm"}>Angekündigt</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size={"sm"}>{event?.announced ?? "N/A"}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size={"sm"}>Erschienen</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size={"sm"}>{event?.visitors ?? "N/A"}</Text>
                </Grid.Col>
              </Grid>
              <Title order={2} size={18} mt={"lg"}>
                Beschreibung
              </Title>
              <Divider />
              <Text size={"sm"} mt={"xs"} fs={!event?.description ? "italic" : ""}>
                {event?.description || "Keine Beschreibung vorhanden."}
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col xs={1}>
            <Stack spacing={0}>
              <Title order={2} size={18}>
                Planungsnotizen
              </Title>
              <Divider />
              <Text size={"sm"} mt={"xs"} fs={!event?.preNotes ? "italic" : ""}>
                {event?.preNotes || "Keine Notizen vorhanden."}
              </Text>
              <Title order={2} size={18} mt={"lg"}>
                Fazit
              </Title>
              <Divider />
              <Text size={"sm"} mt={"xs"} fs={!event?.postNotes ? "italic" : ""}>
                {event?.postNotes || "Keine Notizen vorhanden."}
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
