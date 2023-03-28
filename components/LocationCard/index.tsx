import {
  Badge,
  Card,
  Group,
  SimpleGrid,
  Text,
  Title,
  Center,
  Space,
  Accordion,
  Button,
  Image as MantineImage,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";

import Image from "next/image";

import { IconHome, IconPhotoOff, IconSun } from "@tabler/icons-react";

import { Location } from "../../dbLocations";

import NoGoIcon from "../NoGoIcon";

export default function LocationCard({
  location,
  lastVisitedDay,
  averageVisitors,
  openModal,
  setEditLocationMode,
  setPreValues,
}: {
  location: Location;
  lastVisitedDay: String;
  averageVisitors: String;
  openModal: any;
  setEditLocationMode: any;
  setPreValues: any;
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
          {location?.images?.length > 0 ? (
            location?.images?.map((image) => (
              <Carousel.Slide key={image.publicId}>
                <Image
                  src={image.url}
                  width={350}
                  height={200}
                  alt={`Bild von ${location.name}`}
                  style={{ objectFit: "cover" }}
                  placeholder={"empty"}
                />
              </Carousel.Slide>
            ))
          ) : (
            <MantineImage
              width={350}
              height={200}
              src={null}
              alt="Kein Bild vorhanden"
              withPlaceholder
              placeholder={<IconPhotoOff size={40} />}
            />
          )}
        </Carousel>
      </Card.Section>

      <Title order={2} weight={500} size={"h3"} mt="xs" color={location.noGo ? "red" : ""}>
        {location.name} {location.noGo && <NoGoIcon />}
      </Title>
      <Text size={"xs"}>{location?.address?.suburb}</Text>

      <SimpleGrid cols={2} verticalSpacing="xs" mt={"xs"}>
        <div>
          <Text size={"sm"}>Mittelw. Besucher</Text>
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

      <Button
        variant="light"
        color="blue"
        fullWidth
        mt="xl"
        radius="md"
        onClick={() => {
          setEditLocationMode(true);
          setPreValues(location);
          openModal();
        }}
      >
        Bearbeiten
      </Button>
    </Card>
  );
}
