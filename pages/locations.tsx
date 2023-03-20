import LocationCard from "@/components/LocationCard";
import { Button, Flex, Group, Modal, Space, Title } from "@mantine/core";
import { dbEvents } from "../dbEvents";
import { dbLocations } from "../dbLocations";
import { getLastVisitedDay, getAverageVisitors } from "@/utils/visit";

import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import LocationForm from "@/components/LocationForm";
import { nanoid } from "nanoid";
import { notifications } from "@mantine/notifications";

export default function Locations() {
  const [locations, setLocations] = useLocalStorage(dbLocations);
  const [events] = useLocalStorage(dbEvents);
  const [opened, { open, close }] = useDisclosure(false);

  const createLocation = (values: any, images: string[] = []) => {
    setLocations((prevLocations: any) => [
      ...prevLocations,
      {
        id: nanoid(4),
        name: values?.name,
        address: {
          road: values?.road,
          houseNo: values?.housenNo,
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
      title: "Neue Location",
      message: `${values.name} erfolgreich erstellt!`,
    });
  };

  return (
    <>
      <Title>Locations</Title>
      <Space h={"md"} />
      <Group position={"apart"}>
        <Modal opened={opened} onClose={close} title="Neue Location" centered>
          <LocationForm closeModal={close} createLocation={createLocation} />
        </Modal>

        <Button
          leftIcon={<IconPlus size="1rem" />}
          variant={"light"}
          size={"sm"}
          color={"teal"}
          onClick={open}
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
          />
        ))}
      </Flex>
      <Space h={"xl"} />
    </>
  );
}
