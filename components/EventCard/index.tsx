import {
  Text,
  Card,
  Flex,
  Group,
  Title,
  Tooltip,
  ActionIcon,
  Modal,
  Button,
  Image as MantineImage,
  Stack,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";

import Image from "next/image";

import { getLocalDateTime } from "@/utils/date";

import {
  IconSpeakerphone,
  IconUsers,
  IconInfoCircle,
  IconEdit,
  IconExternalLink,
  IconPhotoOff,
} from "@tabler/icons-react";
import NoGoIcon from "../NoGoIcon";

export default function EventCard({ event, locations }: { event: Event; locations: Location[] }) {
  const [opened, { open, close }] = useDisclosure(false);

  const [location] = locations.filter((location) => location.id === event.locationId);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Infos" centered>
        <Flex direction={"column"} gap={"xs"}>
          {event?.preNotes && (
            <div>
              <Title order={4} size={"sm"}>
                Notizen
              </Title>
              <Text size={"sm"}>{event?.preNotes}</Text>
            </div>
          )}
          {event?.postNotes && (
            <div>
              <Title order={4} size={"sm"}>
                Hinweise
              </Title>
              <Text size={"sm"}>{event?.postNotes}</Text>
            </div>
          )}
          <div>
            <Title order={4} size={"sm"} pb={"sm"}>
              Sonstiges
            </Title>
            <Button
              leftIcon={<IconExternalLink size="1rem" />}
              variant={"light"}
              size={"sm"}
              color={"cyan"}
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              href={event?.fbLink}
              disabled={!event.fbLink}
            >
              FB Event
            </Button>
          </div>
        </Flex>
      </Modal>

      <Card maw={350} shadow="sm">
        <Group noWrap>
          {location?.images?.length > 0 ? (
            <Image
              src={location?.images[0].url}
              width={100}
              height={100}
              alt={`Bild von ${location?.name}`}
              style={{ objectFit: "cover", borderRadius: 5 }}
            />
          ) : (
            <MantineImage
              width={100}
              height={100}
              src={null}
              alt="Kein Bild vorhanden"
              radius={"xs"}
              withPlaceholder
              placeholder={<IconPhotoOff size={40} />}
            />
          )}

          <Group w={"100%"}>
            <Stack spacing={0} maw={"100%"}>
              <Text size={"xs"} w={"100%"}>
                {getLocalDateTime(event?.dateTime)}
              </Text>
              <Title order={3} size={16} truncate maw={180}>
                {event.name}
              </Title>

              <Group spacing={5} align="center">
                <Text size={"sm"} truncate w={"100%"}>
                  {location?.name}
                </Text>
                {location?.noGo && <NoGoIcon />}
              </Group>
            </Stack>

            <Group position="apart" noWrap w={"100%"}>
              <Group spacing={5} noWrap>
                <Tooltip label="Angekündigt">
                  <IconSpeakerphone size={16} />
                </Tooltip>
                <Text size={"xs"}>{event?.announced ?? "-"}</Text>
              </Group>

              <Group spacing={5} noWrap>
                <Tooltip label="Erschienen">
                  <IconUsers size={16} />
                </Tooltip>
                <Text size={"xs"}>{event?.visitors ?? "-"}</Text>
              </Group>

              <ActionIcon variant={"light"} size={"md"} color={"cyan"} onClick={open}>
                <IconInfoCircle size={14} />
              </ActionIcon>
              <ActionIcon variant={"light"} size={"md"} color={"cyan"}>
                <IconEdit size={14} />
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      </Card>
    </>
  );
}
