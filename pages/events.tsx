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
    <Container fluid px={"xl"} py={"xs"}>
      <Title order={1}>Events</Title>
      <Space h={"md"} />
      <Group position={"apart"}>
        <Modal opened={opened} onClose={close} title="Neues Event" centered>
          <EventForm closeModal={close} />
        </Modal>

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
  );
}
