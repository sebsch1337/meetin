import { Flex, Text, Group, Paper, Title, UnstyledButton, rem, Stack, Tooltip, Overlay } from "@mantine/core";
import { IconHome, IconUsers, IconCalendarPin, IconSun, IconPictureInPictureOff } from "@tabler/icons-react";

import Image from "next/image";
import Link from "next/link";

export default function LocationCardCompact({
  location,
  lastVisitedDay,
  averageVisitors,
}: {
  location: Location;
  lastVisitedDay: string;
  averageVisitors: number;
}) {
  return (
    <Link href={`/locations/${location.id}`}>
      <UnstyledButton pos={"relative"} w={250} h={250}>
        {location?.images?.length > 0 && (
          <Image
            src={location?.images[0]?.url}
            width={250}
            height={250}
            alt={"Picture"}
            style={{ objectFit: "cover", borderRadius: rem(15) }}
            placeholder={"empty"}
          />
        )}
        <Paper
          pos={"absolute"}
          top={0}
          w={"100%"}
          h={"100%"}
          style={{ backgroundColor: "rgba(0,0,0,0.25)", borderRadius: rem(15) }}
        />
        <Flex pos={"absolute"} top={0} w={"100%"} h={"100%"} p={10}>
          <Tooltip label="Max. Besucher (Besucherdurchschnitt)">
            <Group pos={"absolute"} align={"center"} spacing={5} style={{ justifyContent: "center" }}>
              <IconUsers
                size={20}
                color="white"
                style={{ filter: "drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.75))" }}
              />
              <Text size={"sm"} color="white" style={{ textShadow: "0px 0px 4px #000000" }}>
                {`${location?.maxCapacity} (${averageVisitors})`}
              </Text>
            </Group>
          </Tooltip>

          <Tooltip label="Indoor / Outdoor">
            <Group pos={"absolute"} align={"center"} spacing={5} top={10} right={10}>
              {location?.indoor && (
                <IconHome
                  size={20}
                  color="white"
                  style={{ filter: "drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.75))" }}
                />
              )}
              {location?.indoor && location?.outdoor && "|"}
              {location?.outdoor && (
                <IconSun
                  size={20}
                  color="white"
                  style={{ filter: "drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.75))" }}
                />
              )}
            </Group>
          </Tooltip>

          <Stack style={{ alignSelf: "center" }} w={"100%"} spacing={0}>
            <Title
              order={2}
              size={24}
              align="center"
              color="white"
              style={{ textShadow: "0px 0px 4px #000000" }}
            >
              {location?.name}
            </Title>
            <Title
              order={3}
              size={16}
              align="center"
              color="white"
              style={{ textShadow: "0px 0px 4px #000000" }}
            >
              {location?.address?.suburb}
            </Title>
          </Stack>

          <Tooltip label="Letzter Besuch">
            <Group
              pos={"absolute"}
              align={"center"}
              spacing={5}
              style={{ alignSelf: "flex-end", justifyContent: "center" }}
            >
              <IconCalendarPin
                size={20}
                color="white"
                style={{ filter: "drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.75))" }}
              />
              <Text size={"sm"} color="white" style={{ textShadow: "0px 0px 4px #000000" }}>
                {lastVisitedDay}
              </Text>
            </Group>
          </Tooltip>
        </Flex>
      </UnstyledButton>
    </Link>
  );
}
