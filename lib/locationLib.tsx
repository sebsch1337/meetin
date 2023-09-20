import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

/**
 * Retrieves all locations from the server.
 *
 * @returns A Promise that resolves to an array containing all the locations if the request is successful.
 *          Otherwise, it returns an undefined value if there was an error during the retrieval.
 */
export const getAllLocations = async (): Promise<Location[]> => {
  const response = await fetch("/api/locations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Failed to fetch locations");
  }
};

/**
 * Creates a new location with the specified values and sends it to the server for creation.
 *
 * @param values The location data to be created on the server.
 * @param setLocations A function to update the state with the newly created location.
 * @returns A Promise that resolves to void if the location is created successfully.
 *          Otherwise, it returns an Error object if there was an error during creation.
 */
export const createLocation = async (values: any, setLocations: React.Dispatch<React.SetStateAction<Location[]>>) => {
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

/**
 * Edits a location with the specified values and updates it on the server.
 *
 * @param values The updated location data to be sent to the server.
 * @param locationId The ID of the location to be edited.
 * @param setLocation A function to update the state with the changed location data.
 * @returns A Promise that resolves to void if the location is edited successfully.
 *          Otherwise, it returns an Error object if there was an error during editing.
 */
export const editLocation = async (values: any, locationId: string, setLocation: React.Dispatch<React.SetStateAction<Location>>) => {
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

/**
 * Deletes a location from the server.
 *
 * @param location The location object to delete.
 * @returns A Promise that resolves to void if the location is deleted successfully.
 *          Otherwise, it returns an Error object if there was an error during deletion.
 */
export const deleteLocation = async (location: Location) => {
  try {
    const response = await fetch(`/api/locations/${location.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to delete location.");
  } catch (error) {
    console.error(error);
    notifications.show({
      icon: <IconX />,
      color: "red",
      title: "Location löschen",
      message: `Location konnte nicht gelöscht werden.`,
    });
    return error;
  }

  notifications.show({
    icon: <IconCheck />,
    title: "Location löschen",
    message: `Location gelöscht.`,
  });
};

export const searchExternalLocation = async (searchString: string): Promise<Location[]> => {
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
