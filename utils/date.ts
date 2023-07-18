export const getLocalDateTimeLong = (date: Date): string =>
  new Date(date).toLocaleString("de-DE", { weekday: "short" }) +
  ", " +
  new Date(date).toLocaleString("de-DE", { dateStyle: "long", timeStyle: "short" });

export const getLocalDateTimeShort = (date: Date): string =>
  new Date(date).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" }).replace(",", "");

export const getLocalDateLong = (date: Date): string =>
  new Date(date).toLocaleDateString("de-DE", { dateStyle: "long" });
