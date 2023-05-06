import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { deleteImage } from "./imageLib";

export const getAllLocations = async (): Promise<any> => {
  const response = await fetch("/api/locations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }
};

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

export const editLocation = async (values: any, locationId: string, setLocation: any) => {
  try {
    const response = await fetch(`/api/locations/${locationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: values }),
    });
    if (!response.ok) throw new Error("Failed to update location.");
    const changedLocationData: any = await response.json();

    setLocation(changedLocationData);

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

export const deleteLocation = async (locationId: any, locations: any, setLocation: any) => {
  const locationToDelete = locations.find((location: any) => location.id === locationId);

  try {
    if (locationToDelete?.images?.length > 0) {
      await Promise.all(
        locationToDelete?.images?.map(async (image: any) => await deleteImage(image.publicId, locationId))
      );
    }
    const response = await fetch(`/api/locations/${locationId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
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

export const searchExternalLocation = async (searchString: string): Promise<any> => {
  const sanitizedSearchString = searchString.replaceAll(" ", "+");
  const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=de&addressdetails=1&q=${sanitizedSearchString}`;

  const response = await fetch(searchUrl);
  if (response.ok) {
    const result = await response.json();
    return result || [];
  } else {
    throw Error;
  }
};
