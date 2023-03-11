import { Title, Space, Flex } from "@mantine/core";

import { dbEvents } from "@/dbEvents";
import { dbLocations } from "@/dbLocations";
import EventCard from "@/components/EventCard";

const events = dbEvents;
const locations = dbLocations;

export default function Events() {
  return (
    <>
      <Title order={1}>Events</Title>
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
