export const getLocalDateTime = (timeStamp: number): string =>
  new Date(timeStamp).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" }).replace(",", "");
