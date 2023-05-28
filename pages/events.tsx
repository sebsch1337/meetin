import { Space, Flex, Group, Button, Modal, Loader, Container, Grid, SimpleGrid } from "@mantine/core";

import EventCard from "@/components/EventCard";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import EventForm from "@/components/EventForm";

import { eventsAtom, locationsAtom } from "@/store";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { getAllEvents } from "@/lib/eventLib";
import { getAllLocations } from "@/lib/locationLib";
import FormModal from "@/components/FormModal";

export default function Events() {
  const [opened, { open, close }] = useDisclosure(false);
  const [events, setEvents] = useAtom(eventsAtom);
  const [locations, setLocations] = useAtom(locationsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      <FormModal title={"Neues Event"} opened={opened} close={close}>
        <EventForm closeModal={close} />
      </FormModal>

      <Container fluid px={isMobile ? "xs" : "xl"} py={"md"}>
        <Button
          leftIcon={<IconPlus size="1rem" />}
          variant={"light"}
          size={"sm"}
          color={"cyan"}
          onClick={open}
        >
          Neues Event
        </Button>

        <Space h={"md"} />

        <SimpleGrid cols={isMobile ? 1 : 3}>
          {isLoading && locations.length === 0 && (
            <Group position="center" w={"100%"}>
              <Loader size="xl" color="teal" variant="dots" />
            </Group>
          )}
          {events.map((event: any) => (
            <EventCard key={event.id} event={event} locations={locations} />
          ))}
        </SimpleGrid>
        <Space h={"xl"} />
      </Container>
    </>
  );
}
