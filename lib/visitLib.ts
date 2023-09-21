import { getLocalDateTimeShort } from "@/utils/date";

/**
 * Returns an array of events filtered by the specified location ID.
 * @param locationId The ID of the location to filter events by.
 * @param events An array of Event objects.
 * @returns An array of events that match the specified location ID.
 */
export const getEventsByLocationId = (locationId: string, events: Event[]): Event[] =>
  events?.length > 0 ? events?.filter((event) => event.locationId === locationId) : [];

/**
 * Returns the last visit event for a specific location based on the provided location ID and events.
 * @param locationId The ID of the location.
 * @param events An array of Event objects.
 * @returns The last visit event object or `false` if no events are found for the location.
 */
export const getLastVisit = (locationId: string, events: Event[]): Event | undefined => {
  const locationEvents = getEventsByLocationId(locationId, events);

  const lastVisit =
    locationEvents.length > 0
      ? locationEvents?.reduce((prev: any, current: any) => (prev.dateTime > current.dateTime ? prev : current))
      : undefined;

  return lastVisit;
};

/**
 * Returns the last visited day for a given location based on the provided location ID and events.
 * @param locationId The ID of the location to retrieve the last visited day for.
 * @param events An array of Event objects.
 * @returns A string representing the last visited day in a long date format (e.g., "January 1, 2023"), or "Nie" if no last visit is available.
 */
export const getLastVisitedDay = (locationId: string, events: Event[]): string => {
  const lastVisit = getLastVisit(locationId, events);
  if (lastVisit?.dateTime) {
    return getLocalDateTimeShort(lastVisit.dateTime);
  } else {
    return "Nie";
  }
};

/**
 * Returns an array of IDs for the five least visited locations based on the provided locations and events.
 * @param locations An array of Location objects.
 * @param events An array of Event objects.
 * @returns An array of string IDs for the five least visited locations.
 */
export const getFiveLeastVisitedLocations = (locations: Location[], events: Event[]): string[] => {
  const locationLastDates: any[] =
    locations?.length > 0
      ? locations
          .filter((location: any) => location.indoor && !location.noGo)
          .map((location: any) => ({
            id: location.id,
            lastVisited: getLastVisit(location.id, events)?.dateTime ?? null,
          }))
          .filter((location: any) => location.lastVisited)
      : [];

  return locationLastDates
    .sort((prev: any, current: any) => new Date(prev.lastVisited).getTime() - new Date(current.lastVisited).getTime())
    .slice(0, 5)
    .map((location: any) => location.id);
};

/**
 * Returns an array of IDs for the locations that have not been visited in the last six months, based on the provided locations and events.
 * @param locations An array of Location objects.
 * @param events An array of Event objects.
 * @returns An array of string IDs for the locations not visited in the last six months.
 */
export const getSixMonthsNotVisitedLocations = (locations: Location[], events: Event[]): string[] => {
  const sixMonthsAgo = new Date().setMonth(new Date().getMonth() - 6);

  return locations?.length > 0
    ? locations
        .filter((location: any) => location.indoor && !location.noGo)
        .filter((location: any) => {
          return (
            !getLastVisit(location.id, events)?.dateTime || new Date(getLastVisit(location.id, events)?.dateTime) < new Date(sixMonthsAgo)
          );
        })
        .map((location: any) => location.id)
    : [];
};

/**
 * Calculates the average number of visitors for a given location based on the provided events.
 * @param locationId The ID of the location.
 * @param events An array of Event objects.
 * @returns The average number of visitors as a number.
 */
export const getAverageVisitors = (locationId: string, events: Event[]): number => {
  const visitedEvents = getEventsByLocationId(locationId, events).filter((event: any) => event.visitors !== undefined);

  if (!visitedEvents || visitedEvents.length < 2) {
    return 0;
  }

  const averageVisitors = Math.round(
    visitedEvents.map((event: any) => event.visitors).reduce((a: number, b: number) => a + b) / visitedEvents.length
  );

  return averageVisitors;
};
