import LocationCard from "@/components/LocationCard";
import { Button, Flex, Group, Modal, Space, Title } from "@mantine/core";
import { dbEvents } from "../dbEvents";
import { dbLocations } from "../dbLocations";
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
    setLocations((prevLocations): any =>
      prevLocations.map((location: any) =>
        location.id === locationId
          ? {
              id: locationId,
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
              // images: images,
              latitude: values?.latitude,
              longitude: values?.longitude,
              test: "test",
            }
          : location
      )
    );

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
        {locations?.map((location) => (
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
