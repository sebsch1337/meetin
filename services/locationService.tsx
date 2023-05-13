import dbConnect from "../lib/dbConnect";
import Locations from "../models/locationsModel";
import { sanitizeLocation, validateLocation } from "@/validators/locationValidator";

/**
 * Gets all locations from the database.
 *
 * @returns An array of sanitized and validated location objects.
 * @throws Error if the locations array is not found or not an array.
 */
export async function getAllLocationsFromDb(): Promise<any> {
  await dbConnect();

  const locations = await Locations.find({}).exec();
  if (!Array.isArray(locations)) throw new Error();

  const sanitizedLocations = await Promise.all(
    locations.map(async (location) => await validateLocation(sanitizeLocation(location)))
  );

  return sanitizedLocations;
}

/**
 * Finds a location in the database by ID.
 *
 * @param id - The ID of the location to find.
 * @returns The sanitized and validated location object.
 * @throws Error if the location is not found.
 */
export async function getLocationByIdFromDb(id: string): Promise<any> {
  await dbConnect();

  const location = await Locations.findById(id).exec();

  const sanitizedLocation = await validateLocation(sanitizeLocation(location));

  return sanitizedLocation;
}

/**
 * Posts a new location to the database.
 *
 * @param location - The location data to store.
 * @returns The sanitized and validated location object.
 */
export async function postLocationToDb(location: any): Promise<any> {
  await dbConnect();

  const sanitizedLocation = await validateLocation(sanitizeLocation(location));
  const newLocation = await Locations.create(sanitizedLocation);
  const returnedLocation = validateLocation(sanitizeLocation(newLocation));

  return returnedLocation;
}

/**
 * Updates a location document with the specified ID in the database.
 * @param id The ID of the location document to update.
 * @param location The updated location document to save to the database.
 * @returns A Promise that resolves to the updated location document in the database.
 * @throws An error indicating that the update operation did not complete successfully.
 */
export async function updateLocationInDb(id: string, location: Location): Promise<any> {
  await dbConnect();

  const [sanitizedId, sanitizedLocation] = await Promise.all([
    await validateLocation(sanitizeLocation({ id })),
    await validateLocation(sanitizeLocation(location)),
  ]);
  const updatedLocation = await Locations.findOneAndUpdate(
    { _id: sanitizedId.id },
    { $set: sanitizedLocation },
    { new: true }
  ).exec();
  if (!updatedLocation) throw new Error();

  const sanitizedUpdatedLocation = await validateLocation(sanitizeLocation(updatedLocation));

  return sanitizedUpdatedLocation;
}

/**
 * Deletes a location from the database using the provided ID.
 *
 * @param id The ID of the location to be deleted.
 * @returns A promise that resolves with the status of the deletion operation.
 * @throws If the deletion operation fails.
 */
export async function deleteLocationFromDb(id: string): Promise<any> {
  await dbConnect();

  const sanitizedId = await validateLocation(sanitizeLocation({ id }));
  const deletedLocation = await Locations.deleteOne({ _id: sanitizedId.id }).exec();
  if (!deletedLocation.acknowledged) throw new Error();

  return deletedLocation;
}

/**
 * Deletes an image with the specified public ID from the database for the given location ID.
 * @param publicId The public ID of the image to delete.
 * @param locationId The ID of the location document to update.
 * @returns A Promise that resolves to the updated location document in the database.
 * @throws An Error if the update operation did not complete successfully.
 */
export const deleteImageByIdFromDb = async (publicId: string, locationId: string): Promise<Location> => {
  await dbConnect();

  const sanitizedId = await validateLocation(sanitizeLocation({ id: locationId }));
  const updatedLocation = await Locations.findOneAndUpdate(
    { _id: sanitizedId.id },
    { $pull: { images: { publicId } } },
    { new: true }
  ).exec();
  if (!updatedLocation) throw new Error();

  return updatedLocation;
};
