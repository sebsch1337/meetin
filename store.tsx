import { atom } from "jotai";

export const locationsAtom = atom<Location[]>([]);

export const eventsAtom = atom<Event[]>([]);

export const modalAtom = atom<Modal>({
  title: "",
  type: "",
  imageId: "",
  locationId: "",
});
