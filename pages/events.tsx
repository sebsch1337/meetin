import { Title, Space, Flex, Group, Button, Modal } from "@mantine/core";

import EventCard from "@/components/EventCard";
import { useDisclosure } from "@mantine/hooks";
import { IconCalendarPlus } from "@tabler/icons-react";
import EventForm from "@/components/EventForm";

import { nanoid } from "nanoid";

import { eventsAtom, locationsAtom } from "@/store";
import { useAtom } from "jotai";

export default function Events() {
  const [opened, { open, close }] = useDisclosure(false);
  const [events, setEvents] = useAtom(eventsAtom);
  const [locations] = useAtom(locationsAtom);

  const addEventToDb = (formData: FormData) => {
    setEvents((events): any => [
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
          <EventForm addEventToDb={addEventToDb} locations={locations} closeModal={close} />
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
        {events.map((event: any) => (
          <EventCard key={event.id} event={event} locations={locations} />
        ))}
      </Flex>
      <Space h={"xl"} />
    </>
  );
}
