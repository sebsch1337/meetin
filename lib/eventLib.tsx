import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

/**
 * Gets all events by making a GET request to the "/api/events" endpoint.
 */
export const getAllEvents = async (): Promise<any> => {
  const response = await fetch("/api/events", {
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

/**
 * Gets all upcoming events from the given event array.
 * @param {Event} events - An array containing all events.
 *
 */
export const getUpcomingEvents = (events: Event[]): Event[] =>
  events
    .filter((event) => new Date(event.dateTime) > new Date())
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

/**
 * Gets all past events from the given event array.
 * @param {Event} events - An array containing all events.
 *
 */
export const getPastEvents = (events: Event[]): Event[] =>
  events
    .filter((event) => new Date(event.dateTime) < new Date())
    .sort((b, a) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

/**
 * Creates an event by making a POST request to the "/api/events" endpoint with the given `values`.
 * @param {Event} values - An object containing the values of the event to be created.
 * @param {any} setEvents - A function that sets the state of the events array with the newly created event.
 */
export const createEvent = async (values: Event, setEvents: any) => {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (response.ok) {
    const data = await response.json();
    setEvents((prevEvents: any): any => [
      ...prevEvents,
      {
        id: data?._id,
        ...data,
      },
    ]);
    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      title: values.name,
      message: `Event erfolgreich erstellt.`,
    });
  } else {
    notifications.show({
      icon: <IconX />,
      color: "red",
      title: values.name,
      message: `Fehler beim Erstellen des Events.`,
    });
  }
};

/**
 * Updates an existing event with the specified ID with new values in the backend API and updates the state of events accordingly.
 * @param values The new values to be updated for the event.
 * @param eventId The ID of the event to be updated.
 * @param setEvents A function to update the state of events.
 * @returns If an error occurs during the update process, it is returned.
 */
export const editEvent = async (values: any, eventId: string) => {
  try {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: values }),
    });

    if (!response.ok) throw new Error("Failed to update event.");
    const newEvent: any = await response.json();

    console.log("newEvent", newEvent);

    notifications.show({
      icon: <IconCheck />,
      title: values.name,
      message: `Event erfolgreich bearbeitet.`,
    });

    return newEvent;
  } catch (error) {
    console.error(error);
    notifications.show({
      icon: <IconX />,
      color: "red",
      message: `Event konnte nicht bearbeitet werden.`,
    });
    return error;
  }
};

/**
 * Deletes an event with the specified ID from the backend API and updates the state of events accordingly.
 * @param eventId The ID of the event to be deleted.
 * @param events The current state of events.
 * @param setEvent A function to update the state of events.
 * @returns If an error occurs during the deletion process, it is returned.
 */
export const deleteEvent = async (eventId: string, events: any, setEvent: any) => {
  try {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to delete event.");
  } catch (error) {
    console.error(error);
    notifications.show({
      icon: <IconX />,
      color: "red",
      message: `Event konnte nicht gelöscht werden.`,
    });
    return error;
  }

  setEvent((prevEvents: any) => prevEvents.filter((prevEvent: any) => prevEvent.id !== eventId));

  notifications.show({
    icon: <IconCheck />,
    title: "Event gelöscht",
    message: `Event wurde erfolgreich gelöscht.`,
  });
};
