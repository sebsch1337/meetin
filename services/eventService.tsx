import { sanitizeTag, validateTag } from "@/validators/tagValidator";
import dbConnect from "../lib/dbConnect";
import Events from "../models/eventsModel";
import { sanitizeEvent, validateEvent } from "@/validators/eventValidator";

/**
 * Gets all events from the database.
 *
 * @returns An array of sanitized and validated event objects.
 * @throws Error if the event array is not found or not an array.
 */
export async function getAllEventsFromDb(): Promise<any> {
  await dbConnect();

  const events = await Events.find({});
  if (!Array.isArray(events)) throw new Error();

  const sanitizedEvents = await Promise.all(
    events.map(async (event) => await validateEvent(sanitizeEvent(event)))
  );

  return sanitizedEvents;
}

/**
 * Posts a new event to the database.
 *
 * @param event - The event data to store.
 * @returns The sanitized and validated event object.
 */
export async function postEventToDb(event: any): Promise<any> {
  await dbConnect();

  const sanitizedEvent = await validateEvent(sanitizeEvent(event));
  const newEvent = await Events.create(sanitizedEvent);
  const returnedEvent = validateEvent(sanitizeEvent(newEvent));

  return returnedEvent;
}

/**
 * Updates an event document with the specified ID in the database.
 * @param id The ID of the event document to update.
 * @param event The updated event document to save to the database.
 * @returns A Promise that resolves to the updated event document in the database.
 * @throws An error indicating that the update operation did not complete successfully.
 */
export async function updateEventInDb(id: string, event: Event): Promise<any> {
  await dbConnect();

  const sanitizedId = await validateEvent(sanitizeEvent({ id: id }));
  const sanitizedEvent = await validateEvent(sanitizeEvent(event));
  const updateEventState = await Events.updateOne({ _id: sanitizedId.id }, { $set: sanitizedEvent });
  if (!updateEventState.acknowledged) throw new Error();

  return updateEventState;
}

/**
 * Deletes a event from the database using the provided ID.
 *
 * @param id The ID of the event to be deleted.
 * @returns A promise that resolves with the status of the deletion operation.
 * @throws If the deletion operation fails.
 */
export async function deleteEventFromDb(id: string): Promise<any> {
  await dbConnect();

  const sanitizedId = await validateEvent(sanitizeEvent({ id: id }));
  const deletedEvent = await Events.deleteOne({ _id: sanitizedId.id });
  if (!deletedEvent.acknowledged) throw new Error();

  return deletedEvent;
}
