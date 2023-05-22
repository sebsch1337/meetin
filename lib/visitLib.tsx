import { getLocalDateLong } from "@/utils/date";

export const getEventsByLocationId = (locationId: string, events: Event[]): any[] =>
  events?.length > 0 ? events?.filter((event) => event.locationId === locationId) : [];

export const getLastVisit = (locationId: string, events: Event[]): any => {
  // console.log(events)
  const locationEvents = getEventsByLocationId(locationId, events);
  return locationEvents?.length > 0
    ? locationEvents.reduce((prev: any, current: any) => (prev.dateTime > current.dateTime ? prev : current))
    : false;
};

export const getLastVisitedDay = (locationId: any, events: Event[]): string => {
  const lastVisit = getLastVisit(locationId, events);

  return lastVisit ? getLocalDateLong(lastVisit.dateTime) : "Nie";
};

export const getFiveLeastVisitedLocations = (locations: Location[], events: Event[]): string[] => {
  const locationLastDates: any[] =
    locations?.length > 0
      ? locations.map((location: any) => ({
          id: location.id,
          lastVisited: getLastVisit(location.id, events).dateTime ?? null,
        }))
      : [];

  return locationLastDates
    .sort(
      (prev: any, current: any) =>
        new Date(prev.lastVisited).getTime() - new Date(current.lastVisited).getTime()
    )
    .slice(0, 5)
    .map((location: any) => location.id);
};

export const getAverageVisitors = (locationId: string, events: Event[]): number => {
  const visitedEvents = getEventsByLocationId(locationId, events).filter(
    (event: any) => event.visitors !== undefined
  );

  if (!visitedEvents || visitedEvents.length < 2) {
    return 0;
  }

  const averageVisitors = Math.round(
    visitedEvents.map((event: any) => event.visitors).reduce((a: number, b: number) => a + b) /
      visitedEvents.length
  );

  return averageVisitors;
};
