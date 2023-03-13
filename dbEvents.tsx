interface DbEvents {
  key: string;
  defaultValue: Event[];
}

export interface Event {
  id: string;
  name: string;
  dateTime: number;
  locationId: string;
  announced?: number;
  visitors?: number;
  preNotes?: string;
  postNotes?: string;
  fbLink?: string;
}

export const dbEvents: DbEvents = {
  key: "dbEvents",
  defaultValue: [
    {
      id: "2k4j",
      name: "Stammtisch 01/2023",
      dateTime: 1678359600,
      locationId: "k543",
      announced: 20,
      visitors: undefined,
      preNotes:
        "Langer Tisch draussen reserviert! Special Menü für alle, die mehr als 20 EUR ausgeben. Keine Deckel!",
      postNotes: "3 Bier blieben übrig. Bezahlt von Trinkgeld. 10 neue waren da. Kellner freundlich.",
      fbLink: "",
    },
    {
      id: "9k4j",
      name: "Stammtisch 02/2023",
      dateTime: 1677754800,
      locationId: "ep30",
      announced: undefined,
      visitors: 13,
      preNotes: "Drinnen am Kickertisch reserviert.",
      postNotes: "",
      fbLink: "https://fb.me/e/7wuw9e6zl",
    },
  ],
};
