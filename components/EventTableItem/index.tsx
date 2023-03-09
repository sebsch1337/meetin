import { getLocalDateTime } from "@/utils/date";
import { Text, Spoiler } from "@mantine/core";

import { Event } from "@/dbEvents";
import { Location } from "@/dbLocations";

export default function EventTableItem({ event, locations }: { event: Event; locations: Location[] }) {
  return (
    <tr key={event.id}>
      <td>{getLocalDateTime(event.date * 1000)}</td>
      <td>{event.name}</td>
      <td>
        <Text color={locations.filter((location) => location.id === event.locationId)[0]?.noGo ? "red" : ""}>
          {locations.filter((location) => location.id === event.locationId)[0]?.name}
        </Text>
      </td>
      <td>{event.announced}</td>
      <td>{event?.visitors ?? <Text color={"dimmed"}>N/A</Text>}</td>
      <td>
        <Spoiler maxHeight={25} hideLabel="Weniger" showLabel="Mehr" maw={250}>
          {event?.notes}
        </Spoiler>
      </td>
    </tr>
  );
}
