import LocationCard from "@/components/LocationCard";
import { Group, Space, Title } from "@mantine/core";
import { dbEvents } from "../dbEvents";
import { dbLocations } from "../dbLocations";
import { getLastVisitedDay, getAverageVisitors } from "@/utils/visit";

import { useLocalStorage } from "@mantine/hooks";

export default function Locations() {
  const [locations, setLocation] = useLocalStorage(dbLocations);
  const [events, setEvents] = useLocalStorage(dbEvents);

  return (
    <>
      <Title>Locations</Title>
      <Space h={"md"} />
      <Group position="center" spacing={"xl"}>
        {locations?.map((location) => (
          <LocationCard
            location={location}
            lastVisitedDay={getLastVisitedDay(location.id, events)}
            averageVisitors={getAverageVisitors(location.id, events)}
            key={location.id}
          />
        ))}
      </Group>
      <Space h={"xl"} />
    </>
  );
}
