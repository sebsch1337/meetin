import LocationCard from "@/components/LocationCard";
import { Button, Flex, Group, Modal, Space, Title } from "@mantine/core";
import { dbEvents } from "../dbEvents";
import { getLastVisitedDay, getAverageVisitors } from "@/utils/visit";

import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { IconCheck, IconPlus } from "@tabler/icons-react";

import { nanoid } from "nanoid";
import { notifications } from "@mantine/notifications";
import LocationForm from "@/components/LocationForm";
import { useState } from "react";

export default function Locations() {
  const [locations, setLocations] = useLocalStorage({ key: "dbLocations", defaultValue: [] });
  const [events] = useLocalStorage(dbEvents);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editLocationMode, setEditLocationMode] = useState(false);
  const [preValues, setPreValues] = useState({});

  const createLocation = (values: any, images: string[] = []) => {
    setLocations((prevLocations): any => [
      ...prevLocations,
      {
        id: nanoid(4),
        name: values?.name,
        address: {
          road: values?.road,
          houseNo: values?.houseNo,
          postcode: values?.postcode,
          city: values?.city,
          suburb: values?.suburb,
        },
        description: values?.description,
        infos: values?.infos,
        tel: values?.tel,
        tags: values?.tags,
        maxCapacity: values?.maxCapacity,
        indoor: values?.indoor,
        outdoor: values?.outdoor,
        noGo: values?.noGo,
        images: images,
        latitude: values?.latitude,
        longitude: values?.longitude,
      },
    ]);

    notifications.show({
      icon: <IconCheck />,
      title: values.name,
      message: `Eintrag erfolgreich erstellt.`,
    });
  };

  const editLocation = (values: any, locationId: string, images: string[] = []) => {
    setLocations((prevLocations): any => {
      const locationToChange: any = prevLocations?.find((location: any) => location.id === locationId);
      locationToChange.name = values?.name;
      locationToChange.address.road = values?.road;
      locationToChange.address.houseNo = values?.houseNo;
      locationToChange.address.postcode = values?.postcode;
      locationToChange.address.city = values?.city;
      locationToChange.address.suburb = values?.suburb;
      locationToChange.description = values?.description;
      locationToChange.infos = values?.infos;
      locationToChange.tel = values?.tel;
      locationToChange.tags = values?.tags;
      locationToChange.maxCapacity = values?.maxCapacity;
      locationToChange.indoor = values?.indoor;
      locationToChange.outdoor = values?.outdoor;
      locationToChange.noGo = values?.noGo;
      // locationToChange.images = values?.noGo;
      locationToChange.latitude = values?.latitude;
      locationToChange.longitude = values?.longitude;

      return prevLocations;
    });

    notifications.show({
      icon: <IconCheck />,
      title: values.name,
      message: `Eintrag erfolgreich bearbeitet.`,
    });
  };

  return (
    <>
      <Title>Locations</Title>
      <Space h={"md"} />
      <Group position={"apart"}>
        <Modal
          opened={modalOpened}
          onClose={closeModal}
          title={editLocationMode ? "Location bearbeiten" : "Neue Location"}
          centered
        >
          <LocationForm
            closeModal={closeModal}
            createLocation={createLocation}
            editLocation={editLocation}
            editLocationMode={editLocationMode}
            preValues={preValues}
          />
        </Modal>

        <Button
          leftIcon={<IconPlus size="1rem" />}
          variant={"light"}
          size={"sm"}
          color={"teal"}
          onClick={() => {
            setEditLocationMode(false);
            setPreValues({});
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
