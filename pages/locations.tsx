import LocationCard from "@/components/LocationCard";
import { Button, Flex, Group, Loader, Modal, Space, Title } from "@mantine/core";
import { getLastVisitedDay, getAverageVisitors } from "@/lib/visitLib";

import { useDisclosure } from "@mantine/hooks";

import LocationForm from "@/components/LocationForm";
import { useEffect, useState } from "react";

import PictureDeleteModal from "@/components/PictureDeleteModal";

import { IconPlus } from "@tabler/icons-react";
import { deleteImage } from "@/lib/imageLib";
import { LocationDeleteModal } from "@/components/LocationDeleteModal";
import { deleteLocation } from "@/lib/locationLib";

import { useAtom } from "jotai";
import { eventsAtom, locationsAtom, tagsAtom, modalAtom } from "@/store";
import { getAllTags } from "@/lib/tagLib";

export default function Locations() {
  const [locations, setLocations] = useAtom(locationsAtom);
  const [tags, setTags] = useAtom(tagsAtom);
  const [events] = useAtom(eventsAtom);
  const [modal, setModal] = useAtom(modalAtom);

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editLocationMode, setEditLocationMode] = useState(false);
  const [preValues, setPreValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAllLocations = async () => {
      try {
        setIsLoading(true);
        const searchUrl = `/api/locations`;
        const response = await fetch(searchUrl);
        const result = await response.json();

        setLocations(result);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
        return e;
      }
    };

    const loadTags = async () => {
      try {
        setIsLoading(true);
        const allTags = await getAllTags();
        setTags(allTags);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
        return e;
      }
    };

    getAllLocations();
    loadTags();
  }, [setLocations, setTags]);

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
        {isLoading && locations.length === 0 && (
          <Group position="center" w={"100%"}>
            <Loader size="xl" color="teal" variant="dots" />
          </Group>
        )}
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
