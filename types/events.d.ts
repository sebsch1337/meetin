interface Event {
  id?: string;
  name: string;
  locationId: string;
  dateTime: date | string;
  going?: number;
  announced?: number;
  visitors?: number;
  description?: string;
  preNotes?: string;
  postNotes?: string;
  fbLink?: string;
  teamId: string;
}
