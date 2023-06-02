import { Text, Card, Group, Title, Tooltip, Stack, Center, Paper, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";

import { getLocalDateTimeLong } from "@/utils/date";

import { IconSpeakerphone, IconUsers, IconPhotoOff } from "@tabler/icons-react";
import NoGoIcon from "../NoGoIcon";
import Link from "next/link";

export default function EventCard({ event, locations }: { event: Event; locations: Location[] }) {
  const [opened, { open, close }] = useDisclosure(false);

  const [location] = locations.filter((location) => location.id === event.locationId);

  return (
    <>
      {/* <Modal opened={opened} onClose={close} title="Infos" centered>
        <Stack spacing={"xs"}>
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
        </Stack>
      </Modal> */}

      <Card component={Link} href={`/events/${event.id}`}>
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
            <Paper w={100} h={100} radius={5}>
              <Center w={100} h={100} mx={"auto"}>
                <IconPhotoOff size={50} />
              </Center>
            </Paper>
          )}

          <Stack>
            <Stack spacing={0} align={"strech"}>
              <Text size={"xs"}>{getLocalDateTimeLong(event?.dateTime)}</Text>
              <Title order={3} size={16} truncate>
                {event.name}
              </Title>
              <Group spacing={5} align="center">
                <Text size={"sm"} truncate>
                  {location?.name}
                </Text>
                {location?.noGo && <NoGoIcon />}
              </Group>
            </Stack>

            <Group>
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
            </Group>
          </Stack>
        </Group>
      </Card>
    </>
  );
}
