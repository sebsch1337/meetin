import { sanitizeAndValidateLocation } from "@/lib/location";
import dbConnect from "../lib/dbConnect";
import Locations from "../models/Locations";

/**
 * Gets all locations from the database.
 *
 * @returns An array of sanitized and validated location objects.
 * @throws Error if the locations array is not found or not an array.
 */
export async function getAllLocationsFromDb() {
  await dbConnect();

  const locations = await Locations.find({});
  if (!Array.isArray(locations)) throw new Error();
  const sanitizedLocations = locations.map((location) => sanitizeAndValidateLocation(location));

  return sanitizedLocations;
}

/**
 * Finds a location in the database by ID.
 *
 * @param id - The ID of the location to find.
 * @returns The sanitized and validated location object.
 * @throws Error if the location is not found.
 */
export async function getLocationByIdFromDb(id: string) {
  await dbConnect();

  const location = await Locations.findById(id);
  if (!location) throw new Error();
  const sanitizedLocation = sanitizeAndValidateLocation(location);

  return sanitizedLocation;
}

/**
 * Posts a new location to the database.
 *
 * @param location - The location data to store.
 * @returns The sanitized and validated location object.
 */
export async function postLocationToDb(location: any) {
  await dbConnect();

  const sanitizedLocation = sanitizeAndValidateLocation(location);
  const newLocation = await Locations.create(sanitizedLocation);
  const returnedLocation = sanitizeAndValidateLocation(newLocation);

  return returnedLocation;
}

/**
 * Updates a location in the database.
 *
 * @param id - The ID of the location to update.
 * @param location - The new location data to store.
 * @returns The updated location object.
 * @throws Error if the update is not acknowledged.
 */
export async function updateLocationInDb(id: string, location: any) {
  await dbConnect();

  const sanitizedLocation = sanitizeAndValidateLocation(location);
  const updateLocationState = await Locations.updateOne({ _id: id }, { $set: sanitizedLocation });
  if (!updateLocationState.acknowledged) throw new Error();

  return updateLocationState;
}

/**
 * Deletes a location from the database using the provided ID.
 *
 * @param id The ID of the location to be deleted.
 * @returns A promise that resolves with the status of the deletion operation.
 * @throws If the deletion operation fails.
 */
export async function deleteLocationFromDb(id: string) {
  await dbConnect();

  const deletedLocation = await Locations.deleteOne({ _id: id });
  if (!deletedLocation.acknowledged) throw new Error();

  return deletedLocation;
}
