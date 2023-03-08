import LocationCard from "@/components/LocationCard";
import { Group, Space, Title } from "@mantine/core";
import { db } from "@/dbLocations";

const dummyData = db;

interface Visit {
  visitors: number;
  date: number;
  notes: string;
}

const getLastVisit = (visits: Visit[]) => {
  visits?.length > 0 ? visits.reduce((prev, current) => (prev.date > current.date ? prev : current)) : false;
};

const getLastVisitedDay = (visits: any): string => {
  const lastVisit = getLastVisit(visits);
  if (lastVisit) {
    return new Date(lastVisit.date * 1000).toLocaleDateString("de-DE", { dateStyle: "long" });
  } else {
    return "Nie";
  }
};

const getAverageVisitors = (visits: any): string => {
  if (!visits || visits?.length === 0) {
    return "N/A";
  }
  const averageVisitors = Math.round(
    visits
      .slice(-3)
      .map((visit) => visit.visitors)
      .reduce((a, b) => a + b) / visits.length
  );
  const minVisitors = Math.min(...visits.slice(-3).map((visit) => visit.visitors));
  const maxVisitors = Math.max(...visits.slice(-3).map((visit) => visit.visitors));

  return `${averageVisitors} (${minVisitors} / ${maxVisitors})`;
};

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
