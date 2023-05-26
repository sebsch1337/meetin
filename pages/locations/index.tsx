import { ActionIcon, Button, Container, Divider, Flex, Group, Loader, Modal, Space } from "@mantine/core";
import { getLastVisitedDay, getAverageVisitors } from "@/lib/visitLib";

import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import LocationForm from "@/components/LocationForm";
import { useEffect, useState } from "react";

import { IconFilter, IconPlus } from "@tabler/icons-react";

import { getAllLocations } from "@/lib/locationLib";

import { useAtom } from "jotai";
import { eventsAtom, locationsAtom, tagsAtom, modalAtom } from "@/store";
import { getAllTags } from "@/lib/tagLib";

import LocationCardCompact from "@/components/LocationCardCompact";
import { getAllEvents } from "@/lib/eventLib";
import LocationFilter from "@/components/LocationFilter";
import LocationSort from "@/components/LocationSort";
import FormModal from "@/components/FormModal";

export default function Locations() {
  const [locations, setLocations] = useAtom(locationsAtom);
  const [tags, setTags] = useAtom(tagsAtom);
  const [events, setEvents] = useAtom(eventsAtom);
  const [modal, setModal] = useAtom(modalAtom);

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editLocationMode, setEditLocationMode] = useState(false);
  const [preValues, setPreValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [filterOpened, setFilterOpened] = useState(false);
  const [filteredTagIds, setFilteredTagIds] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [sortBy, setSortBy] = useState("aToZ");
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [allLocations, allTags, allEvents]: [Location[], Tag[], Event[]] = await Promise.all([
          getAllLocations(),
          getAllTags(),
          getAllEvents(),
        ]);
        setTags([...allTags].sort((a, b) => a.name.localeCompare(b.name)));
        setEvents(allEvents);
        setLocations(
          [...allLocations]
            .sort((a: any, b: any) => a.name.localeCompare(b.name))
            .map((location: any) => ({
              ...location,
              lastVisit:
                allEvents?.find((event: any) => event?.locationId === location?.id)?.dateTime || null,
              averageVisitors: getAverageVisitors(location.id, allEvents),
            }))
        );
      } catch (e) {
        console.error(e);
        return e;
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setEvents, setLocations, setTags]);

  useEffect(() => {
    if (filteredTagIds?.length > 0) {
      setFilteredLocations(
        locations?.filter((location: any) => filteredTagIds?.every((tagId) => location?.tags.includes(tagId)))
      );
    } else {
      setFilteredLocations(locations);
    }
  }, [filteredTagIds, locations]);

  useEffect(() => {
    switch (sortBy) {
      case "aToZ":
        setLocations((location) => [...location].sort((a: any, b: any) => a.name.localeCompare(b.name)));
        break;

      case "leastVisited":
        setLocations((location) =>
          [...location].sort(
            (a: any, b: any) => new Date(a.lastVisit).getTime() - new Date(b.lastVisit).getTime()
          )
        );
        break;

      case "recentlyVisited":
        setLocations((location) =>
          [...location].sort(
            (a: any, b: any) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
          )
        );
        break;

      case "maxVisitors":
        setLocations((location) => [...location].sort((a: any, b: any) => b.maxCapacity - a.maxCapacity));
        break;

      case "averageVisitors":
        setLocations((location) =>
          [...location].sort((a: any, b: any) => b.averageVisitors - a.averageVisitors)
        );
        break;
    }
  }, [sortBy, setLocations]);

  return (
    <>
      <FormModal title={modal.title} opened={modalOpened} close={closeModal}>
        {modal.type === "form" && (
          <LocationForm closeModal={closeModal} editLocationMode={editLocationMode} preValues={preValues} />
        )}
      </FormModal>

      <Container fluid px={isMobile ? "xs" : "xl"} py={"md"}>
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
            Neue Location
          </Button>

          <ActionIcon
            variant={"light"}
            size={"md"}
            color={"teal"}
            onClick={() => {
              setFilterOpened((isOpened) => !isOpened);
            }}
          >
            <IconFilter size="1rem" />
          </ActionIcon>
        </Group>

        {filterOpened && (
          <>
            <Divider my={"md"} />
            <LocationSort sortBy={sortBy} setSortBy={setSortBy} />
            <LocationFilter
              tags={tags}
              setFilteredTagIds={setFilteredTagIds}
              filteredTagIds={filteredTagIds}
            />
          </>
        )}

        <Divider my={"md"} />

        <Flex gap={"xs"} wrap={"wrap"} justify={isMobile ? "space-evenly" : "flex-start"}>
          {isLoading && locations.length === 0 && <Loader size="xl" variant="dots" color="teal" />}
          {filteredLocations?.map((location: any) => (
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
