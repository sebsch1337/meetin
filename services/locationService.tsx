import { sanitizeAndValidateLocation } from "@/lib/location";
import dbConnect from "../lib/dbConnect";
import Locations from "../models/Locations";

/**
 * Retrieves all locations from the database.
 *
 * @returns {Promise<Array<Object>>} - A promise that resolves with an array of sanitized location objects.
 * @throws {Error} - If the retrieval of the locations fails.
 */
export async function getAllLocations() {
  await dbConnect();

  const locations = await Locations.find({});
  if (!Array.isArray(locations)) throw new Error();

  const sanitizedLocations = locations.map((location) => ({
    id: location._id,
    name: location?.name,
    address: {
      road: location?.address?.road,
      houseNo: location?.address?.houseNo,
      postcode: location?.address?.postcode,
      city: location?.address?.city,
      suburb: location?.address?.suburb,
    },
    description: location?.description,
    infos: location?.infos,
    tel: location?.tel,
    tags: location?.tags,
    maxCapacity: location?.maxCapacity,
    indoor: location?.indoor,
    outdoor: location?.outdoor,
    noGo: location?.noGo,
    latitude: location?.latitude,
    longitude: location?.longitude,
  }));

  return sanitizedLocations;
}

export async function getLocationById(id: string) {
  await dbConnect();

  const location = await Locations.findById(id);
  if (!location) {
    throw new Error();
  }

  const sanitizedLocation = {
    id: location._id,
    name: location?.name,
    address: {
      road: location?.address?.road,
      houseNo: location?.address?.houseNo,
      postcode: location?.address?.postcode,
      city: location?.address?.city,
      suburb: location?.address?.suburb,
    },
    description: location?.description,
    infos: location?.infos,
    tel: location?.tel,
    tags: location?.tags,
    maxCapacity: location?.maxCapacity,
    indoor: location?.indoor,
    outdoor: location?.outdoor,
    noGo: location?.noGo,
    latitude: location?.latitude,
    longitude: location?.longitude,
  };

  return sanitizedLocation;
}

/**
 * Adds a new location to the database using the provided data.
 *
 * @param {any} body - The data of the location to be added.
 * @returns {Promise<any>} - A promise that resolves with the newly created location object.
 * @throws {Error} - If the creation of the new location fails.
 */
export async function postLocation(location: any) {
  await dbConnect();

  const sanitizedLocation = sanitizeAndValidateLocation(location);
  const newLocation = await Locations.create(sanitizedLocation);
  const returnedLocation = sanitizeAndValidateLocation(newLocation);
  return returnedLocation;
}

/**
 * Deletes a location from the database using the provided ID.
 *
 * @param {string} id The ID of the location to be deleted.
 * @returns {Promise<any>} A promise that resolves with the status of the deletion operation.
 * @throws {Error} If the deletion operation fails.
 */
export async function deleteLocation(id: string) {
  await dbConnect();

  const deletedLocation = await Locations.deleteOne({ _id: id });
  if (!deletedLocation.acknowledged) {
    throw new Error();
  }

  return deletedLocation;
}

export async function updateLocation(id: string, location: any) {
  await dbConnect();

  const updatedLocation = await Locations.updateOne(
    { _id: id },
    {
      $set: {
        name: location?.name,
        address: {
          road: location?.road,
          houseNo: location?.houseNo,
          postcode: location?.postcode,
          city: location?.city,
          suburb: location?.suburb,
        },
        description: location?.description,
        infos: location?.infos,
        tel: location?.tel,
        tags: location?.tags,
        maxCapacity: location?.maxCapacity,
        indoor: location?.indoor,
        outdoor: location?.outdoor,
        noGo: location?.noGo,
        latitude: location?.latitude,
        longitude: location?.longitude,
      },
    }
  );

  return updatedLocation;
}
