interface Event {
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

interface FormData {
  name: string;
  location: string;
  dateTime: number;
  announced: number;
  visitors: number;
  preNotes: string;
  postNotes: string;
  fbLink: string;
}
