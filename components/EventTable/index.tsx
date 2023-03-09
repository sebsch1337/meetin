import { Table } from "@mantine/core";
import EventTableItem from "../EventTableItem";

import { Event } from "@/dbEvents";
import { Location } from "@/dbLocations";

export default function EventTable({ events, locations }: { events: Event[]; locations: Location[] }) {
  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>Datum</th>
          <th>Name</th>
          <th>Location</th>
          <th>Angekündigt</th>
          <th>Teilgenommen</th>
          <th>Infos</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <EventTableItem key={event.id} event={event} locations={locations} />
        ))}
      </tbody>
    </Table>
  );
}
