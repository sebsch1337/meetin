import { Flex, Text, Group, Paper, Title, UnstyledButton, rem, Stack, Tooltip, Image as MantineImage, Center } from "@mantine/core";
import { useMediaQuery, useWindowEvent } from "@mantine/hooks";
import { IconHome, IconUsers, IconCalendarPin, IconSun, IconPhotoOff } from "@tabler/icons-react";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LocationCardCompactProps {
  location: Location;
  lastVisitedDay: string;
  averageVisitors: number;
}

export const LocationCardCompact: React.FC<LocationCardCompactProps> = ({ location, lastVisitedDay, averageVisitors }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const vwValue = isMobile ? 45 : 18;

  const [responsiveSize, setResponsiveSize] = useState<number>(0);

  useWindowEvent("resize", () => {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const calculatedPixels = (vwValue / 100) * viewportWidth;
    setResponsiveSize(calculatedPixels);
  });

  useEffect(() => {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const calculatedPixels = (vwValue / 100) * viewportWidth;
    setResponsiveSize(calculatedPixels);
  }, [vwValue]);

  return (
    <Link href={`/locations/${location.id}`}>
      <UnstyledButton pos={"relative"} w={responsiveSize} h={responsiveSize}>
        {location?.images?.length > 0 ? (
          <Image
            src={location?.images[0]?.url}
            width={responsiveSize}
            height={responsiveSize}
            alt={"Picture"}
            style={{ objectFit: "cover", borderRadius: rem(15) }}
            placeholder={"empty"}
          />
        ) : (
          <Center>
            <IconPhotoOff size={75} />
          </Center>
        )}
        <Paper pos={"absolute"} top={0} w={"100%"} h={"100%"} style={{ backgroundColor: "rgba(0,0,0,0.50)", borderRadius: rem(15) }} />
        <Flex pos={"absolute"} top={0} w={"100%"} h={"100%"} p={10}>
          <Tooltip label="Max. Besucher (Besucherdurchschnitt)">
            <Group pos={"absolute"} align={"center"} spacing={5} style={{ justifyContent: "center" }}>
              <IconUsers size={16} color="white" style={{ filter: "drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.75))" }} />
              <Text size={"xs"} color="white" style={{ textShadow: "0px 0px 4px #000000" }}>
                {`${location?.maxCapacity ?? 0} (${averageVisitors})`}
              </Text>
            </Group>
          </Tooltip>

          <Tooltip label="Indoor / Outdoor">
            <Group pos={"absolute"} align={"center"} spacing={5} top={10} right={10}>
              {location?.indoor && <IconHome size={16} color="white" style={{ filter: "drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.75))" }} />}
              {location?.indoor && location?.outdoor && "|"}
              {location?.outdoor && <IconSun size={16} color="white" style={{ filter: "drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.75))" }} />}
            </Group>
          </Tooltip>

          <Stack style={{ alignSelf: "center" }} w={"100%"} spacing={0}>
            <Title
              order={2}
              size={"h4"}
              align="center"
              color="white"
              inline
              style={{
                textShadow: "0px 0px 4px #000000",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {location?.name}
            </Title>
            <Text size={"xs"} weight={600} align="center" color="white" style={{ textShadow: "0px 0px 4px #000000" }}>
              {location?.address?.suburb}
            </Text>
          </Stack>

          <Tooltip label="Letzter Besuch">
            <Group pos={"absolute"} align={"center"} spacing={5} style={{ alignSelf: "flex-end", justifyContent: "center" }}>
              <IconCalendarPin size={16} color="white" style={{ filter: "drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.75))" }} />
              <Text size={"xs"} color="white" style={{ textShadow: "0px 0px 4px #000000" }}>
                {lastVisitedDay}
              </Text>
            </Group>
          </Tooltip>
        </Flex>
      </UnstyledButton>
    </Link>
  );
};
