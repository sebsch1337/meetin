interface Event {
  id?: string;
  name: string;
  locationId: string;
  dateTime: date | string;
  announced?: number;
  visitors?: number;
  preNotes?: string;
  postNotes?: string;
  fbLink?: string;
}
