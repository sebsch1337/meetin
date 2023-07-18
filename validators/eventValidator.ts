import { object, string, number, date } from "yup";

export const sanitizeEvent = (event: any) => ({
  id: event?._id?.toString().trim() || event?.id?.toString().trim() || undefined,
  teamId: location?.teamId?.toString().trim(),
  name: event?.name?.toString().trim() || "",
  dateTime: event?.dateTime ? new Date(event.dateTime) : undefined,
  locationId: event?.locationId?.toString().trim() || undefined,
  going: event?.going || null,
  announced: event?.announced || null,
  visitors: event?.visitors || null,
  description: event?.description || "",
  preNotes: event?.preNotes?.toString().trim() || "",
  postNotes: event?.postNotes?.toString().trim() || "",
  fbLink: event?.fbLink?.toString().trim() || "",
});

export const validateEvent = async (event: any) => {
  const eventSchema = object({
    id: string().length(24),
    teamId: string().length(24),
    name: string().max(50),
    dateTime: date(),
    locationId: string().length(24),
    going: number().max(999).nullable(),
    announced: number().max(999).nullable(),
    visitors: number().max(999).nullable(),
    description: string().max(1000),
    preNotes: string().max(1000),
    postNotes: string().max(1000),
    fbLink: string().max(100),
  });

  const validatedEvent = await eventSchema.validate(event);

  return validatedEvent;
};
