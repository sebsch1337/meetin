export interface Event {
  id: number;
  name: string;
  date: number;
  locationId: number;
  announced: number;
  visitors?: number;
  notes?: string;
}

export const dbEvents: Event[] = [
  {
    id: 1,
    name: "Stammtisch #1",
    date: 1678359600,
    locationId: 1,
    announced: 20,
    visitors: undefined,
    notes:
      "Langer Tisch draussen reserviert! Special Menü für alle, die mehr als 20 EUR ausgeben. Keine Deckel!",
  },
  {
    id: 2,
    name: "Stammtisch #2",
    date: 1677754800,
    locationId: 2,
    announced: 15,
    visitors: 14,
    notes: "3 Bier blieben über.",
  },
];
