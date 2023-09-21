import dbConnect from "../lib/dbConnect";
import Events from "../models/eventsModel";
import { sanitizeEvent, validateEvent } from "@/validators/eventValidator";

/**
 * Gets all events from the database.
 *
 * @returns An array of sanitized and validated event objects.
 * @throws Error if the event array is not found or not an array.
 */
export async function getAllEventsFromDb(teamId: string): Promise<any[]> {
  if (!teamId) return [];

  await dbConnect();

  const events = await Events.find({ teamId }).sort({ dateTime: -1 }).exec();
  if (!Array.isArray(events)) throw new Error();

  const sanitizedEvents = await Promise.all(events.map(async (event) => await validateEvent(sanitizeEvent(event))));

  const newEvents = sanitizedEvents.map((event: any): any[] => ({
    ...event,
    dateTime: event.dateTime.toISOString(),
  }));

  return newEvents.length > 0 ? newEvents : [];
}

/**
 * Retrieves an event from the database based on the provided event ID.
 * @param eventId - The ID of the event to retrieve.
 * @returns A promise that resolves to the retrieved event.
 * @throws If the event is not found in the database.
 */
export async function getEventByIdFromDb(eventId: string, teamId: string): Promise<Event | null> {
  if (!teamId) return null;

  await dbConnect();

  const sanitizedInput = await validateEvent(sanitizeEvent({ id: eventId }));

  const event = await Events.findOne({ _id: sanitizedInput.id, teamId }).exec();
  if (!event) throw new Error("Event not found");

  const sanitizedEvent = await validateEvent(sanitizeEvent(event));
  const newEvent = {
    ...sanitizedEvent,
    dateTime: sanitizedEvent?.dateTime?.toISOString(),
  } as Event;

  return newEvent;
}

/**
 * Gets all events for a location from the database.
 *
 * @param locationId - The ID of the location to search for.
 * @returns An array of sanitized and validated event objects.
 * @throws Error if the event array is not found or not an array.
 */
export async function getAllEventsByLocationIdFromDb(locationId: string, teamId: string): Promise<any[]> {
  if (!teamId) return [];

  await dbConnect();

  const events = await Events.find({ locationId, teamId }).sort({ dateTime: -1 }).exec();
  if (!Array.isArray(events)) throw new Error();

  const sanitizedEvents = await Promise.all(events.map(async (event) => await validateEvent(sanitizeEvent(event))));

  const newEvents = sanitizedEvents.map((event: any): any[] => ({
    ...event,
    dateTime: event.dateTime.toISOString(),
  }));

  return newEvents.length > 0 ? newEvents : [];
}

/**
 * Posts a new event to the database.
 *
 * @param event - The event data to store.
 * @returns The sanitized and validated event object.
 */
export async function postEventToDb(event: Event, teamId: string): Promise<any> {
  if (!teamId) return;
  event.teamId = teamId;
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
export async function updateEventInDb(id: string, event: Event, teamId: string): Promise<any> {
  if (!teamId) return;

  await dbConnect();

  const eventData = { ...event, id, teamId };
  const sanitizedEvent = await validateEvent(sanitizeEvent(eventData));

  const updatedEvent = await Events.findOneAndUpdate({ _id: sanitizedEvent.id, teamId }, { $set: sanitizedEvent }, { new: true }).exec();
  if (!updatedEvent) throw new Error();

  const sanitizedNewEvent = await validateEvent(sanitizeEvent(updatedEvent));
  return sanitizedNewEvent;
}

/**
 * Deletes a event from the database using the provided ID.
 *
 * @param id The ID of the event to be deleted.
 * @returns A promise that resolves with the status of the deletion operation.
 * @throws If the deletion operation fails.
 */
export async function deleteEventFromDb(id: string, teamId: string): Promise<any> {
  if (!teamId) return;

  await dbConnect();

  const sanitizedId = await validateEvent(sanitizeEvent({ id: id }));
  const deletedEvent = await Events.deleteOne({ _id: sanitizedId.id, teamId }).exec();
  if (!deletedEvent.acknowledged) throw new Error();

  return deletedEvent;
}
