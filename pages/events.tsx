import EventTable from "@/components/EventTable";
import { Title, Space } from "@mantine/core";

import { dbEvents } from "@/dbEvents";
import { dbLocations } from "@/dbLocations";

const events = dbEvents;
const locations = dbLocations;

export default function Events() {
  return (
    <>
      <Title>Events</Title>
      <Space h={"md"} />
      <EventTable events={events} locations={locations} />
      <Space h={"xl"} />
    </>
  );
}
