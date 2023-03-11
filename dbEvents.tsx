export interface Event {
  id: number;
  name: string;
  date: number;
  locationId: number;
  announced?: number;
  visitors?: number;
  preNotes?: string;
  postNotes?: string;
  fbLink?: string;
}

export const dbEvents: Event[] = [
  {
    id: 1,
    name: "Stammtisch #1",
    date: 1678359600,
    locationId: 1,
    announced: 20,
    visitors: undefined,
    preNotes:
      "Langer Tisch draussen reserviert! Special Menü für alle, die mehr als 20 EUR ausgeben. Keine Deckel!",
    postNotes: "3 Bier blieben übrig. Bezahlt von Trinkgeld. 10 neue waren da. Kellner freundlich.",
    fbLink: "",
  },
  {
    id: 2,
    name: "Stammtisch #2",
    date: 1677754800,
    locationId: 2,
    announced: undefined,
    visitors: 13,
    preNotes: "Drinnen am Kickertisch reserviert.",
    postNotes: "",
    fbLink: "https://fb.me/e/7wuw9e6zl",
  },
];
