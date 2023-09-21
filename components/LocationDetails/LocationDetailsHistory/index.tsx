import { getLocalDateTimeShort } from "@/utils/date";
import { Table, Text } from "@mantine/core";
import Link from "next/link";

interface LocationDetailsHistoryProps {
  locationEvents: Event[];
}

export const LocationDetailsHistory: React.FC<LocationDetailsHistoryProps> = ({ locationEvents = [] }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Datum</th>
          <th>Event</th>
        </tr>
      </thead>
      <tbody>
        {locationEvents?.length > 0 &&
          locationEvents?.map((event: Event): any => (
            <tr key={event?.id}>
              <td style={{ whiteSpace: "nowrap" }}>{getLocalDateTimeShort(event?.dateTime)}</td>
              <td>
                <Text component={Link} href={`/events/${event.id}`}>
                  {event?.name}
                </Text>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};
