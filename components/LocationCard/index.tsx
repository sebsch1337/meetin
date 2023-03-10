import {
  Badge,
  Image,
  Card,
  Group,
  SimpleGrid,
  Text,
  Title,
  Center,
  Space,
  Accordion,
  Button,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";

import { IconHome, IconInfoCircle, IconSun } from "@tabler/icons-react";

import { Location } from "../../dbLocations";

export default function LocationCard({
  location,
  lastVisitedDay,
  averageVisitors,
}: {
  location: Location;
  lastVisitedDay: String;
  averageVisitors: String;
}) {
  return (
    <Card w={350} mih={550} shadow="sm" padding="xl" key={location.id}>
      <Card.Section>
        <Carousel
          withIndicators
          maw={350}
          styles={{
            control: {
              "&[data-inactive]": {
                opacity: 0,
                cursor: "default",
              },
            },
          }}
        >
          {location.images.map((image) => (
            <Carousel.Slide key={image}>
              <Image
                src={image}
                width={350}
                height={200}
                alt={`Bild von ${location.name}`}
                style={{ position: "relative" }}
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Card.Section>

      <Title order={2} weight={500} size={"h3"} mt="xs" color={location.noGo ? "red" : ""}>
        {location.name} {location.noGo && <IconInfoCircle size={15} />}
      </Title>
      <Text size={"xs"}>Innenstadt West</Text>

      <SimpleGrid cols={2} verticalSpacing="xs" mt={"xs"}>
        <div>
          <Text size={"sm"}>Mittelwert Besucher</Text>
          <Text color="dimmed" size="sm">
            {averageVisitors}
          </Text>
        </div>
        <div>
          <Text size={"sm"}>Letzter Besuch</Text>
          <Text color="dimmed" size="sm">
            {lastVisitedDay}
          </Text>
        </div>

        <div>
          <Text size={"sm"}>Max. Besucher</Text>
          <Text color="dimmed" size="sm">
            {location.maxCapacity}
          </Text>
        </div>
        <div>
          <Text size={"sm"}>Indoor / Outdoor</Text>
          <Center inline>
            <IconHome color={location.indoor ? "teal" : "grey"} size={18} />
            <Space w="xs" />
            {"/"}
            <Space w="xs" />
            <IconSun color={location.outdoor ? "yellow" : "grey"} size={18} />
          </Center>
        </div>
      </SimpleGrid>

      <Accordion
        variant="filled"
        styles={{
          control: { paddingInline: 0, paddingTop: 15, paddingBottom: 5 },
          content: { padding: 0 },
        }}
      >
        <Accordion.Item value="description">
          <Accordion.Control>
            <Text size={"sm"} weight={500}>
              Beschreibung
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text size={"sm"}>{location.description}</Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="information">
          <Accordion.Control>
            <Text size={"sm"} weight={500}>
              Interne Informationen
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text size={"sm"}>{location.infos}</Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Group mt={"md"} mb={"md"} spacing={"xs"} mih={45}>
        {location?.tags.map((tag) => (
          <Badge variant={"outline"} key={tag} size={"xs"}>
            {tag}
          </Badge>
        ))}
      </Group>

      <Button variant="light" color="blue" fullWidth mt="xl" radius="md">
        Bearbeiten
      </Button>
    </Card>
  );
}
