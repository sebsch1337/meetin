import { object, string, number, date } from "yup";

export const sanitizeEvent = (event: any) => {
  const sanitizedEvent = {
    id: event?._id?.toString().trim() || event?.id?.toString().trim() || undefined,
    name: event?.name?.toString().trim() || "",
    dateTime: event?.dateTime ? new Date(event.dateTime) : undefined,
    locationId: event?.locationId?.toString().trim() || undefined,
    announced: event?.announced || null,
    visitors: event?.visitors || null,
    description: event?.description || "",
    preNotes: event?.preNotes?.toString().trim() || "",
    postNotes: event?.postNotes?.toString().trim() || "",
    fbLink: event?.fbLink?.toString().trim() || "",
  };

  return sanitizedEvent;
};

export const validateEvent = async (event: any) => {
  let eventSchema = object({
    id: string().length(24),
    name: string().max(50),
    dateTime: date(),
    locationId: string().length(24),
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
