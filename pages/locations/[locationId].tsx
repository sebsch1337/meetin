import { useState } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import { ActionIcon, Container, Flex, LoadingOverlay, Tabs, Text, Title, rem } from "@mantine/core";
import { IconEdit, IconHistory, IconInfoCircle, IconMap2, IconPhoto } from "@tabler/icons-react";

import { deleteLocation } from "@/lib/locationLib";
import { getAverageVisitors, getLastVisitedDay } from "@/lib/visitLib";

import { getAllEventsByLocationIdFromDb } from "@/services/eventService";
import { getLocationByIdFromDb } from "@/services/locationService";
import { getAllTagsFromDb } from "@/services/tagService";

import { LocationDetailsPictures } from "@/components/LocationDetails/LocationDetailsPictures";
import { LocationDetailsHistory } from "@/components/LocationDetails/LocationDetailsHistory";
import { LocationDetailsBasics } from "@/components/LocationDetails/LocationDetailsBasics";
import { LocationForm } from "@/components/LocationForm";
import { DetailsModal } from "@/components/DetailsModal";
import { DeleteModal } from "@/components/DeleteModal";

import dynamic from "next/dynamic";
const LocationDetailsMap = dynamic((): any => import("@/components/LocationDetails/LocationDetailsMap"), {
  ssr: false,
});

import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/login", permanent: false } };
  if (!session?.user?.teamId) return { redirect: { destination: "/", permanent: false } };

  const locationId = context.params.locationId;

  try {
    const [locationData, locationEvents, tags] = await Promise.all([
      getLocationByIdFromDb(locationId, session?.user?.teamId),
      getAllEventsByLocationIdFromDb(locationId, session?.user?.teamId),
      getAllTagsFromDb(),
    ]);

    if (locationData.id) {
      const averageVisitors = getAverageVisitors(locationId, locationEvents);
      const lastVisit = getLastVisitedDay(locationId, locationEvents);

      return {
        props: {
          locationData,
          locationEvents,
          tags,
          averageVisitors,
          lastVisit,
        },
      };
    } else {
      return { redirect: { destination: "/404", permanent: false } };
    }
  } catch (error) {
    console.error(error);
  }
}

export default function LocationDetails({
  locationData,
  locationEvents,
  tags,
  averageVisitors,
  lastVisit,
}: {
  locationData: Location;
  locationEvents: Event[];
  tags: Tag[];
  averageVisitors: number;
  lastVisit: string;
}): JSX.Element {
  const [location, setLocation] = useState<Location>(locationData ?? {});
  const [events] = useState<Event[]>(locationEvents ?? []);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>("infos");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [modal, setModal] = useState<Modal>({});
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editLocationMode, setEditLocationMode] = useState(false);

  return (
    <>
      <DetailsModal opened={modalOpened} onClose={closeModal} modal={modal}>
        {modal.type === "form" && (
          <LocationForm
            closeModal={closeModal}
            editLocationMode={editLocationMode}
            preValues={location}
            tags={tags}
            setLocation={setLocation}
            setModal={setModal}
          />
        )}
        {modal.type === "deleteLocation" && <DeleteModal type={"location"} deleteData={async () => await deleteLocation(location)} />}
      </DetailsModal>

      <LoadingOverlay visible={loading} overlayBlur={2} />

      <Container
        h={"20vh"}
        fluid
        p={0}
        style={{
          backgroundImage: `url(${location?.images?.length > 0 ? location.images[0]?.url : ""})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          objectFit: "cover",
          position: "relative",
        }}
      >
        <ActionIcon
          variant={"light"}
          size={"md"}
          style={{ position: "absolute", top: rem(10), right: rem(10) }}
          onClick={() => {
            setEditLocationMode(true);
            setModal({
              title: "Location bearbeiten",
              type: "form",
            });
            openModal();
          }}
        >
          <IconEdit size="1.5rem" />
        </ActionIcon>
        <Flex
          w={"100%"}
          h={"100%"}
          justify={"center"}
          align={"center"}
          direction={"column"}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <Title order={1} color={"white"} style={{ textShadow: "0px 0px 4px #000000" }}>
            {location.name}
          </Title>
          <Text size={20} color={"white"} style={{ textShadow: "0px 0px 4px #000000" }}>
            {location?.address?.suburb}
          </Text>
        </Flex>
      </Container>
      <Tabs defaultValue="infos" color="teal" value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List grow>
          <Tabs.Tab value="infos" icon={<IconInfoCircle size="0.8rem" />}>
            Infos
          </Tabs.Tab>
          <Tabs.Tab value="gallery" icon={<IconPhoto size="0.8rem" />}>
            Galerie
          </Tabs.Tab>
          <Tabs.Tab value="map" icon={<IconMap2 size="0.8rem" />}>
            Karte
          </Tabs.Tab>
          <Tabs.Tab value="history" icon={<IconHistory size="0.8rem" />}>
            Verlauf
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="infos" pt="xs">
          {activeTab === "infos" && (
            <LocationDetailsBasics location={location} averageVisitors={averageVisitors} lastVisit={lastVisit} tags={tags} />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="gallery" pt="xs">
          {activeTab === "gallery" && (
            <LocationDetailsPictures location={location} setLoading={setLoading} setLocation={setLocation} isMobile={isMobile} />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="map" pt="xs">
          {activeTab === "map" && (
            <LocationDetailsMap
              //@ts-ignore
              latitude={location?.latitude}
              longitude={location?.longitude}
              isMobile={isMobile}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="history" pt="xs">
          <LocationDetailsHistory locationEvents={events} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
