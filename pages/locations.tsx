import LocationCard from "@/components/LocationCard";
import { Flex, Space, Title } from "@mantine/core";
import { dbEvents } from "../dbEvents";
import { dbLocations } from "../dbLocations";
import { getLastVisitedDay, getAverageVisitors } from "@/utils/visit";

import { useLocalStorage } from "@mantine/hooks";

export default function Locations() {
  const [locations] = useLocalStorage(dbLocations);
  const [events] = useLocalStorage(dbEvents);

  return (
    <>
      <Title>Locations</Title>
      <Space h={"md"} />
      <Flex gap={"xs"} wrap={"wrap"}>
        {locations?.map((location) => (
          <LocationCard
            location={location}
            lastVisitedDay={getLastVisitedDay(location.id, events)}
            averageVisitors={getAverageVisitors(location.id, events)}
            key={location.id}
          />
        ))}
      </Flex>
      <Space h={"xl"} />
    </>
  );
}
