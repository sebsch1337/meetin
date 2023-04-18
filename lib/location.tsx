import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { deleteImage } from "./image";

export const createLocation = async (values: any, setLocations: any) => {
  const response = await fetch("/api/locations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (response.ok) {
    const data = await response.json();
    setLocations((prevLocations: any): any => [
      ...prevLocations,
      {
        id: data?._id,
        ...data,
      },
    ]);
    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      title: values.name,
      message: `Location erfolgreich erstellt.`,
    });
  } else {
    notifications.show({
      icon: <IconX />,
      color: "red",
      title: values.name,
      message: `Fehler beim Erstellen der Location.`,
    });
  }
};

export const editLocation = async (values: any, locationId: string, setLocations: any) => {
  try {
    const response = await fetch("/api/locations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: locationId, values: values }),
    });
    if (!response.ok) throw new Error("Failed to update location.");
    const changedLocationData: any = await response.json();

    setLocations(changedLocationData);

    notifications.show({
      icon: <IconCheck />,
      title: values.name,
      message: `Location erfolgreich bearbeitet.`,
    });
  } catch (error) {
    console.error(error);
    notifications.show({
      icon: <IconX />,
      color: "red",
      message: `Location konnte nicht bearbeitet werden.`,
    });
    return error;
  }
};

export const deleteLocation = async (locationId: string, locations: any, setLocation: any) => {
  const locationToDelete = locations.find((location: any) => location.id === locationId);

  try {
    if (locationToDelete?.images?.length > 0) {
      await Promise.all(
        locationToDelete?.images?.map(async (image: any) => await deleteImage(image.publicId, locationId))
      );
    }
    const response = await fetch("/api/locations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: locationId }),
    });
    if (!response.ok) throw new Error("Failed to delete location.");
  } catch (error) {
    console.error(error);
    notifications.show({
      icon: <IconX />,
      color: "red",
      message: `Location konnte nicht gelöscht werden.`,
    });
    return error;
  }

  setLocation((prevLocations: any) =>
    prevLocations.filter((prevLocation: any) => prevLocation.id !== locationId)
  );

  notifications.show({
    icon: <IconCheck />,
    title: "Location gelöscht",
    message: `Location wurde erfolgreich gelöscht.`,
  });
};
