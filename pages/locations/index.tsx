import { Button, Container, Flex, Group, Modal, Skeleton, Space, Title } from "@mantine/core";
import { getLastVisitedDay, getAverageVisitors } from "@/lib/visitLib";

import { useDisclosure } from "@mantine/hooks";

import LocationForm from "@/components/LocationForm";
import { useEffect, useState } from "react";

import PictureDeleteModal from "@/components/PictureDeleteModal";

import { IconPlus } from "@tabler/icons-react";
import { deleteImage } from "@/lib/imageLib";
import { LocationDeleteModal } from "@/components/LocationDeleteModal";
import { deleteLocation, getAllLocations } from "@/lib/locationLib";

import { useAtom, useSetAtom } from "jotai";
import { eventsAtom, locationsAtom, tagsAtom, modalAtom } from "@/store";
import { getAllTags } from "@/lib/tagLib";

import LocationCardCompact from "@/components/LocationCardCompact";

export default function Locations() {
  const [locations, setLocations] = useAtom(locationsAtom);
  const setTags = useSetAtom(tagsAtom);
  const [events] = useAtom(eventsAtom);
  const [modal, setModal] = useAtom(modalAtom);

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editLocationMode, setEditLocationMode] = useState(false);
  const [preValues, setPreValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [allLocations, allTags] = await Promise.all([getAllLocations(), getAllTags()]);
        setLocations(allLocations);
        setTags(allTags);
      } catch (e) {
        console.error(e);
        return e;
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setLocations, setTags]);

  return (
    <Container fluid px={"xl"} py={"xs"}>
      <Title>Locations</Title>
      <Space h={"md"} />
      <Group position={"apart"}>
        <Modal opened={modalOpened} onClose={closeModal} title={modal.title} centered>
          {modal.type === "form" && (
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
              type: "form",
            }));
            openModal();
          }}
        >
          Neue Location erstellen
        </Button>
      </Group>
      <Space h={"md"} />

      <Flex gap={"xs"} wrap={"wrap"}>
        {isLoading &&
          locations.length === 0 &&
          Array.from({ length: 4 }).map((_, count) => (
            <Flex
              w={250}
              h={250}
              justify={"center"}
              align={"center"}
              direction={"column"}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              key={count}
            >
              <Skeleton w={"90%"} height={32} radius="xl" />
              <Skeleton w={"50%"} height={18} mt={10} radius="xl" />
            </Flex>
          ))}
        {locations?.map((location: any) => (
          <LocationCardCompact
            key={location.id}
            location={location}
            lastVisitedDay={getLastVisitedDay(location.id, events)}
            averageVisitors={getAverageVisitors(location.id, events)}
          />
        ))}
      </Flex>
      <Space h={"xl"} />
    </Container>
  );
}
