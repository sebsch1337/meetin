interface Visit {
  visitors: number;
  date: number;
  notes: string;
}

import { Event } from "@/dbEvents";

export const getEventsByLocationId = (locationId: string, events: Event[]): any =>
  events?.filter((event) => event.locationId === locationId);

export const getLastVisit = (locationId: string, events: Event[]): any =>
  getEventsByLocationId(locationId, events)?.reduce((prev: any, current: any) =>
    prev.dateTime > current.dateTime ? prev : current
  ) || false;

export const getLastVisitedDay = (locationId: string, events: Event[]): string => {
  const lastVisit = getLastVisit(locationId, events);
  if (lastVisit) {
    return new Date(lastVisit.dateTime * 1000).toLocaleDateString("de-DE", { dateStyle: "long" });
  } else {
    return "Nie";
  }
};

export const getAverageVisitors = (locationId: string, events: Event[]): string => {
  const visitedEvents = getEventsByLocationId(locationId, events).filter(
    (event: any) => event.visitors !== undefined
  );

  if (!visitedEvents || visitedEvents.length < 2) {
    return "N/A";
  }

  const averageVisitors = Math.round(
    visitedEvents.map((event: any) => event.visitors).reduce((a: number, b: number) => a + b) /
      visitedEvents.length
  );
  const minVisitors = Math.min(...visitedEvents.slice(-3).map((event: any) => event.visitors));
  const maxVisitors = Math.max(...visitedEvents.slice(-3).map((event: any) => event.visitors));

  return `${averageVisitors} (${minVisitors} / ${maxVisitors})`;
};
