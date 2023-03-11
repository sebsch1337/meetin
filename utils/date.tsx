export const getLocalDateTime = (timeStamp: number): string =>
  new Date(timeStamp).toLocaleString("de-DE", { weekday: "short" }) +
  ", " +
  new Date(timeStamp).toLocaleString("de-DE", { dateStyle: "long", timeStyle: "short" });
