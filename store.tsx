import { atom } from "jotai";

export const locationsAtom = atom<Location[]>([]);

export const eventsAtom: any = atom<Event[]>([]);

export const modalAtom = atom<Modal>({
  title: "",
  type: "",
  imageId: "",
  locationId: "",
});
