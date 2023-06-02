import { Card, Flex, Group, Stack, Text, Title } from "@mantine/core";
import Image from "next/image";

import { getLocalDateTimeLong } from "@/utils/date";

import { IconPhotoOff } from "@tabler/icons-react";
import NoGoIcon from "../NoGoIcon";
import Link from "next/link";

export default function EventCardCompact({ event, location }: { event: Event; location: any }) {
  return (
    <Card component={Link} href={`/events/${event.id}`} style={{ background: "transparent" }} p={"xs"}>
      <Group noWrap>
        {location?.images?.length > 0 ? (
          <Image
            src={location?.images[0].url}
            width={50}
            height={50}
            alt={`Bild von ${location?.name}`}
            style={{ objectFit: "cover", borderRadius: 5 }}
          />
        ) : (
          <Flex w={50} h={50} justify={"center"} align={"center"}>
            <IconPhotoOff size={40} />
          </Flex>
        )}

        <Group noWrap>
          <Stack spacing={0} w={"100%"}>
            <Text size={"xs"} truncate>
              {getLocalDateTimeLong(event?.dateTime)}
            </Text>
            <Title order={3} size={"h6"} truncate>
              {event.name}
            </Title>
            <Group spacing={5} align="center">
              <Text size={"xs"} truncate>
                {location?.name}
              </Text>
              {location?.noGo && <NoGoIcon />}
            </Group>
          </Stack>
        </Group>
      </Group>
    </Card>
  );
}
