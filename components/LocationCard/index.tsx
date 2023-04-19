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
  ActionIcon,
  rem,
  getStylesRef,
  Flex,
  LoadingOverlay,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";

import Image from "next/image";

import { IconEdit, IconHome, IconSun, IconTrash } from "@tabler/icons-react";

import NoGoIcon from "../NoGoIcon";
import PictureDropzone from "../PictureDropzone";
import { useState } from "react";

import { useSetAtom } from "jotai";
import { modalAtom } from "@/store";

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
  const [loading, setLoading] = useState(false);
  const setModal = useSetAtom(modalAtom);

  return (
    <Card w={350} mih={550} shadow="sm" padding="xl" key={location.id}>
      <Card.Section>
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <Carousel
          withIndicators
          speed={25}
          maw={350}
          styles={{
            control: {
              "&[data-inactive]": {
                opacity: 0,
                cursor: "default",
              },
            },
            indicator: {
              width: rem(12),
              height: rem(4),
              transition: "width 250ms ease",

              "&[data-active]": {
                width: rem(40),
              },
            },
            controls: {
              ref: getStylesRef("controls"),
              transition: "opacity 150ms ease",
              opacity: 0,
            },

            root: {
              "&:hover": {
                [`& .${getStylesRef("controls")}`]: {
                  opacity: 1,
                },
              },
            },
          }}
        >
          {location?.images?.length > 0 &&
            location?.images?.map((image) => (
              <Carousel.Slide key={image.publicId}>
                <ActionIcon
                  variant="light"
                  style={{ position: "absolute", top: "1rem", right: "2rem", zIndex: 2 }}
                  onClick={async () => {
                    setModal((prev): any => ({
                      ...prev,
                      title: "Bild löschen",
                      type: "deleteImage",
                      imageId: image.publicId,
                      locationId: location.id,
                    }));
                    openModal();
                  }}
                >
                  <IconTrash />
                </ActionIcon>
                <Image
                  src={image.url}
                  width={350}
                  height={200}
                  alt={`Bild von ${location.name}`}
                  style={{ objectFit: "cover" }}
                  placeholder={"empty"}
                />
              </Carousel.Slide>
            ))}
          <Carousel.Slide>
            <Flex justify={"center"} align={"center"} gap={"xs"} h={200}>
              <PictureDropzone preValues={location} setLoading={setLoading} />
            </Flex>
          </Carousel.Slide>
        </Carousel>
      </Card.Section>

      <Title order={2} weight={500} size={"h3"} mt="xs" color={location?.noGo ? "red" : ""}>
        {location?.name} {location?.noGo && <NoGoIcon />}
      </Title>
      <Text size={"xs"}>{location?.address?.suburb}</Text>

      <SimpleGrid cols={2} verticalSpacing="xs" mt={"xs"}>
        <div>
          <Text size={"sm"}>Besucherzahl</Text>
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
            {location?.maxCapacity}
          </Text>
        </div>
        <div>
          <Text size={"sm"}>Lokalität</Text>
          <Center inline>
            <IconHome color={location?.indoor ? "teal" : "grey"} size={18} />
            <Space w="xs" />
            {"|"}
            <Space w="xs" />
            <IconSun color={location?.outdoor ? "yellow" : "grey"} size={18} />
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
            <Text size={"sm"}>{location?.description}</Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="information">
          <Accordion.Control>
            <Text size={"sm"} weight={500}>
              Interne Informationen
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text size={"sm"}>{location?.infos}</Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Group mt={"md"} mb={"md"} spacing={"xs"} mih={45}>
        {location?.tags?.map((tag) => (
          <Badge variant={"outline"} key={tag} size={"xs"}>
            {tag}
          </Badge>
        ))}
      </Group>

      <Button
        variant="light"
        leftIcon={<IconEdit size="1rem" />}
        size={"sm"}
        color="teal"
        fullWidth
        mt="xl"
        radius="md"
        onClick={() => {
          setEditLocationMode(true);
          setPreValues(location);
          setModal((prev) => ({
            ...prev,
            title: "Location bearbeiten",
            type: "details",
          }));
          openModal();
        }}
      >
        Details bearbeiten
      </Button>
    </Card>
  );
}
