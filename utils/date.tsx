export const getLocalDateTime = (date: Date): string =>
  new Date(date).toLocaleString("de-DE", { weekday: "short" }) +
  ", " +
  new Date(date).toLocaleString("de-DE", { dateStyle: "long", timeStyle: "short" });
