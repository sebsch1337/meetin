import LocationCard from "@/components/LocationCard";
import { Group, Space, Title } from "@mantine/core";
import { dbLocations } from "../dbLocations";
import { getLastVisitedDay, getAverageVisitors } from "@/utils/visit";
const dummyData = dbLocations;

export default function Locations() {
  return (
    <>
      <Title>Locations</Title>
      <Space h={"md"} />
      <Group position="center" spacing={"xl"}>
        {dummyData?.map((location) => (
          <LocationCard
            location={location}
            lastVisitedDay={getLastVisitedDay(location.visits)}
            averageVisitors={getAverageVisitors(location.visits)}
            key={location.id}
          />
        ))}
      </Group>
      <Space h={"xl"} />
    </>
  );
}
