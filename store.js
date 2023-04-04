import { atom } from "jotai";

export const locationsAtom = atom([]);

export const eventsAtom = atom([]);

export const modalAtom = atom({
  title: "",
  type: "",
  imageId: "",
  locationId: "",
});
