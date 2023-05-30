import dbConnect from "../lib/dbConnect";
import Events from "../models/eventsModel";
import { sanitizeEvent, validateEvent } from "@/validators/eventValidator";

/**
 * Gets all events from the database.
 *
 * @returns An array of sanitized and validated event objects.
 * @throws Error if the event array is not found or not an array.
 */
export async function getAllEventsFromDb(): Promise<any[]> {
  await dbConnect();

  const events = await Events.find({}).sort({ dateTime: -1 }).exec();
  if (!Array.isArray(events)) throw new Error();

  const sanitizedEvents = await Promise.all(
    events.map(async (event) => await validateEvent(sanitizeEvent(event)))
  );

  const newEvents = sanitizedEvents.map((event: any): any[] => ({
    ...event,
    dateTime: event.dateTime.toISOString(),
  }));

  return newEvents;
}

/**
 * Retrieves an event from the database based on the provided event ID.
 * @param eventId - The ID of the event to retrieve.
 * @returns A promise that resolves to the retrieved event.
 * @throws If the event is not found in the database.
 */
export async function getEventByIdFromDb(eventId: string): Promise<any> {
  await dbConnect();

  const sanitizedInput = await validateEvent(sanitizeEvent({ id: eventId }));

  const event = await Events.findById(sanitizedInput.id).exec();
  if (!event) throw new Error("Event not found");

  const sanitizedEvent = await validateEvent(sanitizeEvent(event));
  const newEvent = {
    ...sanitizedEvent,
    dateTime: sanitizedEvent?.dateTime?.toISOString(),
  };

  return newEvent;
}

/**
 * Gets all events for a location from the database.
 *
 * @param locationId - The ID of the location to search for.
 * @returns An array of sanitized and validated event objects.
 * @throws Error if the event array is not found or not an array.
 */
export async function getAllEventsByLocationIdFromDb(locationId: string): Promise<any> {
  await dbConnect();

  const events = await Events.find({ locationId }).sort({ dateTime: -1 }).exec();
  if (!Array.isArray(events)) throw new Error();

  const sanitizedEvents = await Promise.all(
    events.map(async (event) => await validateEvent(sanitizeEvent(event)))
  );

  const newEvents = sanitizedEvents.map((event: any): any[] => ({
    ...event,
    dateTime: event.dateTime.toISOString(),
  }));

  return newEvents;
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

  const [sanitizedId, sanitizedEvent] = await Promise.all([
    await validateEvent(sanitizeEvent({ id })),
    await validateEvent(sanitizeEvent(event)),
  ]);
  const updateEventState = await Events.updateOne({ _id: sanitizedId.id }, { $set: sanitizedEvent }).exec();
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
  const deletedEvent = await Events.deleteOne({ _id: sanitizedId.id }).exec();
  if (!deletedEvent.acknowledged) throw new Error();

  return deletedEvent;
}
