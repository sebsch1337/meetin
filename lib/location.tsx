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
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: locationId, values: values }),
    });
    if (!response.ok) throw new Error("Failed to update location.");
    const newLocation: any = await response.json();

    setLocations((prevLocations: any) => {
      const locationToChange: any = prevLocations?.find((location: any) => location.id === locationId);
      locationToChange.name = newLocation?.name;
      locationToChange.address.road = newLocation?.address?.road;
      locationToChange.address.houseNo = newLocation?.address?.houseNo;
      locationToChange.address.postcode = newLocation?.address?.postcode;
      locationToChange.address.city = newLocation?.address?.city;
      locationToChange.address.suburb = newLocation?.address?.suburb;
      locationToChange.description = newLocation?.description;
      locationToChange.infos = newLocation?.infos;
      locationToChange.tel = newLocation?.tel;
      locationToChange.tags = newLocation?.tags;
      locationToChange.maxCapacity = newLocation?.maxCapacity;
      locationToChange.indoor = newLocation?.indoor;
      locationToChange.outdoor = newLocation?.outdoor;
      locationToChange.noGo = newLocation?.noGo;
      locationToChange.latitude = newLocation?.latitude;
      locationToChange.longitude = newLocation?.longitude;
      locationToChange.images = newLocation?.images;

      return prevLocations;
    });

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
    console.log("deleting images...");
    if (locationToDelete?.images?.length > 0) {
      await Promise.all(
        locationToDelete?.images?.map(async (image: any) => await deleteImage(image.publicId, locationId))
      );
    }
    console.log("deleting images done.");
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

export const sanitizeAndValidateLocation = (location: Location) => {
  const sanitizedLocation = {
    id: location?._id || location.id,
    name: location?.name?.trim(),
    address: {
      road: location?.address?.road?.trim() || location?.road?.trim(),
      houseNo: location?.address?.houseNo?.trim() || location?.houseNo?.trim(),
      postcode: location?.address?.postcode?.trim() || location?.postcode?.trim(),
      city: location?.address?.city?.trim() || location?.city?.trim(),
      suburb: location?.address?.suburb?.trim() || location?.suburb?.trim(),
    },
    description: location?.description?.trim(),
    infos: location?.infos?.trim(),
    tel: location?.tel?.trim(),
    tags: location?.tags?.map((tag: string) => tag.trim()),
    maxCapacity: location?.maxCapacity,
    indoor: location?.indoor,
    outdoor: location?.outdoor,
    noGo: location?.noGo,
    latitude: location?.latitude,
    longitude: location?.longitude,
    images: location?.images,
  };

  if (sanitizedLocation?.name && sanitizedLocation?.name?.length > 50) {
    const error: any = new Error("Invalid location name");
    error.status = 400;
    throw error;
  }

  if (sanitizedLocation?.address?.road && sanitizedLocation?.address?.road?.length > 100) {
    const error: any = new Error("Invalid road name");
    error.status = 400;
    throw error;
  }

  if (sanitizedLocation?.address?.houseNo && sanitizedLocation.address.houseNo.length > 5) {
    const error: any = new Error("Invalid house number");
    error.status = 400;
    throw error;
  }

  if (sanitizedLocation?.address?.postcode && sanitizedLocation?.address?.postcode?.length > 7) {
    const error: any = new Error("Invalid postcode");
    error.status = 400;
    throw error;
  }

  if (sanitizedLocation?.address?.city && sanitizedLocation?.address?.city?.length > 100) {
    const error: any = new Error("Invalid city name");
    error.status = 400;
    throw error;
  }

  if (sanitizedLocation?.address?.suburb && sanitizedLocation?.address?.suburb?.length > 100) {
    const error: any = new Error("Invalid city name");
    error.status = 400;
    throw error;
  }

  if (sanitizedLocation?.description && sanitizedLocation?.description?.length > 500) {
    const error: any = new Error("Description is too long");
    error.status = 400;
    throw error;
  }

  if (sanitizedLocation?.infos && sanitizedLocation?.infos?.length > 500) {
    const error: any = new Error("Information is too long");
    error.status = 400;
    throw error;
  }

  if (sanitizedLocation?.tel && sanitizedLocation?.tel?.length > 20) {
    const error: any = new Error("Phone number is too long");
    error.status = 400;
    throw error;
  }

  if (sanitizedLocation?.tags && sanitizedLocation?.tags?.length > 6) {
    const error: any = new Error("Too many tags (max. 6)");
    error.status = 400;
    throw error;
  }

  if (sanitizedLocation?.maxCapacity && sanitizedLocation?.maxCapacity > 1000) {
    const error: any = new Error("Invalid max capacity");
    error.status = 400;
    throw error;
  }

  if (sanitizedLocation.latitude && (sanitizedLocation.latitude < -90 || sanitizedLocation.latitude > 90)) {
    const error: any = new Error("Invalid latitude");
    error.status = 400;
    throw error;
  }

  if (
    sanitizedLocation.longitude &&
    (sanitizedLocation.longitude < -180 || sanitizedLocation.longitude > 180)
  ) {
    const error: any = new Error("Invalid longitude");
    error.status = 400;
    throw error;
  }

  return sanitizedLocation;
};
