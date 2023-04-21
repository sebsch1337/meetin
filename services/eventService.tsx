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
