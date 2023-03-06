import { Badge, Image, Card, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { AnyCnameRecord } from "dns";

import { db } from "../../dummy";

interface Visit {
  visitors: number;
  date: number;
  notes: string;
}

const getLastVisit = (visits: Visit[]) => {
  const lastVisit = visits.reduce((prev, current) => (prev.date > current.date ? prev : current));
  return lastVisit;
};

const getLastVisitedDay = (visits: any): string => {
  const lastVisit = getLastVisit(visits);
  return new Date(lastVisit.date * 1000).toLocaleDateString("de-DE", { dateStyle: "long" });
};

const dummyData = db;

export default function LocationCard() {
  return (
    <Group>
      {dummyData?.map((location) => (
        <Card
          style={{ width: 350, minHeight: 450 }}
          shadow="sm"
          padding="xl"
          component="a"
          target="_blank"
          key={location.id}
        >
          <Card.Section>
            <Image
              src={`https://source.unsplash.com/random/?bar-${location.id}`}
              width={350}
              height={200}
              alt="No way!"
            />
          </Card.Section>

          <Title order={2} weight={500} size={"h3"} my="xs">
            {location.name}
          </Title>

          <SimpleGrid cols={2} verticalSpacing="xs">
            <div>
              <Text size={"sm"}>Mittelwert Besucher</Text>
              <Text color="dimmed" size="sm">
                {Math.round(
                  location.visits
                    .slice(-3)
                    .map((visit) => visit.visitors)
                    .reduce((a, b) => a + b) / location.visits.length
                )}{" "}
                {`(${Math.min(...location.visits.slice(-3).map((visit) => visit.visitors))} / ${Math.max(
                  ...location.visits.slice(-3).map((visit) => visit.visitors)
                )})`}
              </Text>
            </div>
            <div>
              <Text size={"sm"}>Letzter Besuch</Text>
              <Text color="dimmed" size="sm">
                {getLastVisitedDay(location.visits)}
              </Text>
            </div>

            <div>
              <Text size={"sm"}>Geeignet für</Text>
              <Text color="dimmed" size="sm">
                {location.maxCapacity}
              </Text>
            </div>
            <div>
              <Text size={"sm"}>Stadtteil</Text>
              <Text color="dimmed" size="sm">
                City
              </Text>
            </div>
          </SimpleGrid>
          <Group mt={"md"} spacing={"xs"}>
            {location.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </Group>
        </Card>
      ))}
    </Group>
  );
}
