import { Title, Space, Flex, Group, Button, Modal } from "@mantine/core";

import { dbEvents } from "@/dbEvents";
import { dbLocations } from "@/dbLocations";
import EventCard from "@/components/EventCard";
import { useDisclosure } from "@mantine/hooks";
import { IconCalendarPlus } from "@tabler/icons-react";
import EventForm from "@/components/EventForm";

import { nanoid } from "nanoid";

import { useLocalStorage } from "@mantine/hooks";

interface FormData {
  name: string;
  location: string;
  dateTime: number;
  announced: number;
  visitors: number;
  preNotes: string;
  postNotes: string;
  fbLink: string;
}

export default function Events() {
  const [opened, { open, close }] = useDisclosure(false);
  const [events, setEvents] = useLocalStorage(dbEvents);
  const [locations] = useLocalStorage(dbLocations);

  const addEventToDb = (formData: FormData) => {
    setEvents((events) => [
      ...events,
      {
        id: nanoid(4),
        name: formData.name,
        locationId: formData.location,
        dateTime: Math.round(formData.dateTime / 1000),
        announced: formData?.announced ?? null,
        visitors: formData?.visitors ?? null,
        preNotes: formData?.preNotes ?? "",
        postNotes: formData?.postNotes ?? "",
        fbLink: formData?.fbLink ?? "",
      },
    ]);
  };

  return (
    <>
      <Title order={1}>Events</Title>
      <Space h={"md"} />
      <Group position={"apart"}>
        <Modal opened={opened} onClose={close} title="Neues Event" centered>
          <EventForm addEventToDb={addEventToDb} locations={locations} />
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
        {events.map((event) => (
          <EventCard key={event.id} event={event} locations={locations} />
        ))}
      </Flex>
      <Space h={"xl"} />
    </>
  );
}
