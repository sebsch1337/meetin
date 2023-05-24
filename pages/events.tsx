import { Title, Space, Flex, Group, Button, Modal, Loader, Container } from "@mantine/core";

import EventCard from "@/components/EventCard";
import { useDisclosure } from "@mantine/hooks";
import { IconCalendarPlus } from "@tabler/icons-react";
import EventForm from "@/components/EventForm";

import { eventsAtom, locationsAtom } from "@/store";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { getAllEvents } from "@/lib/eventLib";
import { getAllLocations } from "@/lib/locationLib";

export default function Events() {
  const [opened, { open, close }] = useDisclosure(false);
  const [events, setEvents] = useAtom(eventsAtom);
  const [locations, setLocations] = useAtom(locationsAtom);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [allEvents, allLocations] = await Promise.all([getAllEvents(), getAllLocations()]);
        setEvents(allEvents);
        setLocations(allLocations);
      } catch (e) {
        console.error(e);
        return e;
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setEvents, setLocations]);

  return (
    <>
      <Modal.Root opened={opened} onClose={close}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header style={{ zIndex: 200 }} px={0} mx={"md"}>
            <Modal.Title>{"Neues Event"}</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <EventForm closeModal={close} />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <Container fluid px={"xl"} py={"xs"}>
        <Group position={"apart"}>
          <Button
            leftIcon={<IconCalendarPlus size="1rem" />}
            variant={"light"}
            size={"sm"}
            color={"cyan"}
            onClick={open}
          >
            Neues Event erstellen
          </Button>
        </Group>
        <Space h={"md"} />

        <Flex gap={"xs"} wrap={"wrap"}>
          {isLoading && locations.length === 0 && (
            <Group position="center" w={"100%"}>
              <Loader size="xl" color="teal" variant="dots" />
            </Group>
          )}
          {events.map((event: any) => (
            <EventCard key={event.id} event={event} locations={locations} />
          ))}
        </Flex>
        <Space h={"xl"} />
      </Container>
    </>
  );
}
