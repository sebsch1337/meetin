import LocationCard from "@/components/LocationCard";
import { Button, Flex, Group, Modal, Space, Title } from "@mantine/core";
import { getLastVisitedDay, getAverageVisitors } from "@/lib/visit";

import { useDisclosure } from "@mantine/hooks";

import LocationForm from "@/components/LocationForm";
import { useState } from "react";

import PictureDeleteModal from "@/components/PictureDeleteModal";

import { IconPlus } from "@tabler/icons-react";
import { deleteImage } from "@/lib/image";
import { LocationDeleteModal } from "@/components/LocationDeleteModal";
import { deleteLocation } from "@/lib/location";
import { getAllLocationsFromDb } from "@/services/locationService";

import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { eventsAtom, locationsAtom, modalAtom } from "@/store";

export async function getServerSideProps() {
  const locationsDb: Location[] = await getAllLocationsFromDb();

  return {
    props: {
      locationsDb: locationsDb,
    },
  };
}

export default function Locations({ locationsDb }: { locationsDb: Location[] }) {
  // @ts-ignore
  useHydrateAtoms([[locationsAtom, locationsDb]]);
  const [locations, setLocations] = useAtom(locationsAtom);
  const [events] = useAtom(eventsAtom);
  const [modal, setModal] = useAtom(modalAtom);

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editLocationMode, setEditLocationMode] = useState(false);
  const [preValues, setPreValues] = useState({});

  return (
    <>
      <Title>Locations</Title>
      <Space h={"md"} />
      <Group position={"apart"}>
        <Modal opened={modalOpened} onClose={closeModal} title={modal.title} centered>
          {modal.type === "details" && (
            <LocationForm closeModal={closeModal} editLocationMode={editLocationMode} preValues={preValues} />
          )}
          {modal.type === "deleteImage" && (
            <PictureDeleteModal
              deleteImage={async () => await deleteImage(modal.imageId, modal.locationId, setLocations)}
              closeModal={closeModal}
            />
          )}
          {modal.type === "deleteLocation" && (
            <LocationDeleteModal
              deleteLocation={async () => await deleteLocation(modal.locationId, locations, setLocations)}
              closeModal={closeModal}
            />
          )}
        </Modal>

        <Button
          leftIcon={<IconPlus size="1rem" />}
          variant={"light"}
          size={"sm"}
          color={"teal"}
          onClick={() => {
            setEditLocationMode(false);
            setPreValues({});
            setModal((prev) => ({
              ...prev,
              title: "Neue Location",
              type: "details",
            }));
            openModal();
          }}
        >
          Neue Location erstellen
        </Button>
      </Group>
      <Space h={"md"} />
      <Flex gap={"xs"} wrap={"wrap"}>
        {locations?.map((location: any) => (
          <LocationCard
            location={location}
            lastVisitedDay={getLastVisitedDay(location.id, events)}
            averageVisitors={getAverageVisitors(location.id, events)}
            key={location.id}
            setEditLocationMode={setEditLocationMode}
            setPreValues={setPreValues}
            openModal={openModal}
          />
        ))}
      </Flex>
      <Space h={"xl"} />
    </>
  );
}
