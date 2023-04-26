import { Container, Flex, Overlay, Space, Title, rem } from "@mantine/core";
import Image from "next/image";

import { useAtom, useSetAtom } from "jotai";
import { eventsAtom, locationsAtom, tagsAtom, modalAtom } from "@/store";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { getLocationByIdFromDb } from "@/services/locationService";

export async function getServerSideProps(context: any) {
  const locationId = context.params.locationId;

  const locationData = await getLocationByIdFromDb(locationId);

  return {
    props: {
      locationId,
      locationData,
    },
  };
}

export default function LocationDetails({
  locationId,
  locationData,
}: {
  locationId: string;
  locationData: Location;
}) {
  const [location, setLocation] = useState(locationData ?? {});
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Container
        h={"30vh"}
        fluid
        p={0}
        style={{
          backgroundImage: `url(${location?.images[0]?.url})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          objectFit: "cover",
        }}
      >
        <Flex
          w={"100%"}
          h={"100%"}
          justify={"center"}
          align={"center"}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
        >
          <Title order={1} color={"white"} style={{ textShadow: "0px 0px 4px #000000" }}>
            {location.name}
          </Title>
        </Flex>
      </Container>
    </>
  );
}
