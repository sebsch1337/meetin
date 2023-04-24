interface Event {
  id?: string;
  name: string;
  locationId: string;
  dateTime: date;
  announced?: number;
  visitors?: number;
  preNotes?: string;
  postNotes?: string;
  fbLink?: string;
}
