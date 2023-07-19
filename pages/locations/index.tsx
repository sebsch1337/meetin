import { useEffect, useState } from "react";

import { ActionIcon, Button, Center, Container, Flex, Group, Loader, Space } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import { getLastVisitedDay, getAverageVisitors } from "@/lib/visitLib";
import { getAllLocations } from "@/lib/locationLib";
import { getAllTags } from "@/lib/tagLib";
import { getAllEvents } from "@/lib/eventLib";

import LocationCardCompact from "@/components/LocationCardCompact";
import LocationForm from "@/components/LocationForm";
import LocationFilter from "@/components/LocationFilter";
import LocationSort from "@/components/LocationSort";
import FormModal from "@/components/FormModal";
import SearchInput from "@/components/SearchInput";

import { IconFilter, IconPlus } from "@tabler/icons-react";

import { useAtom } from "jotai";
import { eventsAtom, locationsAtom, tagsAtom, modalAtom } from "@/store";

import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/login", permanent: false } };
  if (!session?.user?.teamId) return { redirect: { destination: "/", permanent: false } };

  return { props: {} };
}

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
  const [searchLocation, setSearchLocation] = useState("");
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
              lastVisit: allEvents?.find((event: any) => event?.locationId === location?.id)?.dateTime || null,
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
      setFilteredLocations(locations?.filter((location: any) => filteredTagIds?.every((tagId) => location?.tags.includes(tagId))));
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
          [...location].sort((a: any, b: any) => new Date(a.lastVisit).getTime() - new Date(b.lastVisit).getTime())
        );
        break;

      case "recentlyVisited":
        setLocations((location) =>
          [...location].sort((a: any, b: any) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
        );
        break;

      case "maxVisitors":
        setLocations((location) => [...location].sort((a: any, b: any) => b.maxCapacity - a.maxCapacity));
        break;

      case "averageVisitors":
        setLocations((location) => [...location].sort((a: any, b: any) => b.averageVisitors - a.averageVisitors));
        break;
    }
  }, [sortBy, setLocations]);

  return (
    <>
      <FormModal title={modal.title} opened={modalOpened} close={closeModal}>
        {modal.type === "form" && (
          <LocationForm closeModal={closeModal} editLocationMode={editLocationMode} preValues={preValues} tags={tags} />
        )}
      </FormModal>

      <Container fluid px={isMobile ? "xs" : "xl"} py={"md"}>
        <Group position={"apart"} noWrap>
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

          <Group noWrap>
            <SearchInput searchString={searchLocation} setSearchString={setSearchLocation} />

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
        </Group>

        {filterOpened && (
          <>
            <LocationSort sortBy={sortBy} setSortBy={setSortBy} />
            <LocationFilter tags={tags} setFilteredTagIds={setFilteredTagIds} filteredTagIds={filteredTagIds} />
          </>
        )}

        <Space h={"md"} />

        {isLoading && locations.length === 0 && (
          <Center>
            <Loader size="xl" color="teal" variant="dots" />
          </Center>
        )}

        <Flex gap={"xs"} wrap={"wrap"} justify={isMobile ? "space-evenly" : "flex-start"}>
          {filteredLocations
            ?.filter((location) => location.name?.toLowerCase().includes(searchLocation.toLowerCase()))
            .map((location: any) => (
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
