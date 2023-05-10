import { getLocalDateTimeShort } from "@/utils/date";
import { Table } from "@mantine/core";

export default function LocationDetailsHistory({ locationEvents = [] }: { locationEvents: any }) {
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
              <td>{event?.name}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
