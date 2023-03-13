import { Text, Card, Flex, Group, Title, Tooltip, ActionIcon, Modal, Button } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";

import Image from "next/image";

import { getLocalDateTime } from "@/utils/date";

import { Event } from "@/dbEvents";
import { Location } from "@/dbLocations";
import { IconSpeakerphone, IconUsers, IconInfoCircle, IconEdit, IconExternalLink } from "@tabler/icons-react";
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
      <Card w={350} shadow="sm">
        <Flex>
          <Group>
            <Image
              src={location.images[0]}
              width={100}
              height={100}
              alt={`Bild von ${location.name}`}
              style={{ objectFit: "cover", borderRadius: 5 }}
            />
          </Group>

          <Flex
            justify="space-between"
            align="flex-start"
            direction="column"
            wrap="nowrap"
            pl={"sm"}
            w={"100%"}
          >
            <div>
              <Text size={"xs"}>{getLocalDateTime(event.dateTime * 1000)}</Text>
              <Title order={3} size={18} truncate>
                {event.name}
              </Title>

              <Group spacing={5} align="center">
                <Text size={"sm"} maw={180} truncate>
                  {location.name}
                </Text>
                {location.noGo && <NoGoIcon />}
              </Group>
            </div>
            <Flex justify={"space-between"} w={"100%"}>
              <Group spacing={5}>
                <Tooltip label="Angekündigt">
                  <IconSpeakerphone size={18} />
                </Tooltip>
                <Text size={"sm"}>{event?.announced ?? "-"}</Text>
              </Group>
              <Group spacing={5}>
                <Tooltip label="Erschienen">
                  <IconUsers size={18} />
                </Tooltip>
                <Text size={"sm"}>{event?.visitors ?? "-"}</Text>
              </Group>
              <ActionIcon variant={"light"} size={"md"} color={"cyan"} onClick={open}>
                <IconInfoCircle size={16} />
              </ActionIcon>
              <ActionIcon variant={"light"} size={"md"} color={"cyan"}>
                <IconEdit size={16} />
              </ActionIcon>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </>
  );
}
