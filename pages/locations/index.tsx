import { Button, Container, Flex, Group, Loader, Modal, Skeleton, Space, Title } from "@mantine/core";
import { getLastVisitedDay, getAverageVisitors } from "@/lib/visitLib";

import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import LocationForm from "@/components/LocationForm";
import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";

import { getAllLocations } from "@/lib/locationLib";

import { useAtom, useSetAtom } from "jotai";
import { eventsAtom, locationsAtom, tagsAtom, modalAtom } from "@/store";
import { getAllTags } from "@/lib/tagLib";

import LocationCardCompact from "@/components/LocationCardCompact";
import { getAllEvents } from "@/lib/eventLib";

export default function Locations() {
  const [locations, setLocations] = useAtom(locationsAtom);
  const setTags = useSetAtom(tagsAtom);
  const [events, setEvents] = useAtom(eventsAtom);
  const [modal, setModal] = useAtom(modalAtom);

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editLocationMode, setEditLocationMode] = useState(false);
  const [preValues, setPreValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [allLocations, allTags, allEvents] = await Promise.all([
          getAllLocations(),
          getAllTags(),
          getAllEvents(),
        ]);
        setLocations(allLocations);
        setTags(allTags);
        setEvents(allEvents);
      } catch (e) {
        console.error(e);
        return e;
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setLocations, setTags, setEvents]);

  return (
    <>
      <Modal.Root opened={modalOpened} onClose={closeModal}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header style={{ zIndex: 200 }} px={0} mx={"md"}>
            <Modal.Title>{modal.title}</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            {modal.type === "form" && (
              <LocationForm
                closeModal={closeModal}
                editLocationMode={editLocationMode}
                preValues={preValues}
              />
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <Container fluid px={"xl"} py={"xs"}>
        <Title>Locations</Title>
        <Space h={"md"} />
        <Group position={"apart"}>
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

        <Flex gap={"xs"} wrap={"wrap"} justify={isMobile ? "center" : "flex-start"}>
          {isLoading && locations.length === 0 && <Loader size="xl" variant="dots" color="teal" />}
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
    </>
  );
}
