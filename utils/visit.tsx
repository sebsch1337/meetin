interface Visit {
  visitors: number;
  date: number;
  notes: string;
}

import { Event } from "@/dbEvents";

export const getLocationEvents = (locationId: string, events: Event[]): any =>
  events?.filter((event) => event.locationId === locationId);

export const getLastVisit = (locationId: string, events: Event[]): any =>
  getLocationEvents(locationId, events)?.reduce((prev: any, current: any) =>
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
  const locationEvents = getLocationEvents(locationId, events);

  if (!locationEvents) {
    return "N/A";
  }
  const averageVisitors = Math.round(
    locationEvents
      .slice(-3)
      .map((event: any) => event.visitors)
      .reduce((a: number, b: number) => a + b) / locationEvents.length
  );
  const minVisitors = Math.min(...locationEvents.slice(-3).map((event: any) => event.visitors));
  const maxVisitors = Math.max(...locationEvents.slice(-3).map((event: any) => event.visitors));

  return `${averageVisitors} (${minVisitors} / ${maxVisitors})`;
};
