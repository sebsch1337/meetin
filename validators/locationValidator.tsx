import { object, string, number, array, bool } from "yup";

export const sanitizeLocation = (location: any) => {
  const sanitizedAddress = {
    road: location?.address?.road?.toString().trim() || undefined,
    houseNo: location?.address?.houseNo?.toString().trim() || undefined,
    postcode: location?.address?.postcode?.toString().trim() || undefined,
    city: location?.address?.city?.toString().trim() || undefined,
    suburb: location?.address?.suburb?.toString().trim() || undefined,
  };

  const sanitizedLocation = {
    id: location?._id?.toString().trim() || location?.id?.toString().trim() || undefined,
    name: location?.name?.toString().trim() || undefined,
    description: location?.description?.toString().trim() || undefined,
    infos: location?.infos?.toString().trim() || undefined,
    maxCapacity: location?.maxCapacity || undefined,
    latitude: location?.latitude || undefined,
    longitude: location?.longitude || undefined,
    indoor: location?.indoor || undefined,
    outdoor: location?.outdoor || undefined,
    noGo: location?.noGo || undefined,
    tags: location?.tags?.length > 0 ? location.tags : undefined,
    images: location?.images?.length > 0 ? location.images : undefined,
  };

  return {
    ...sanitizedLocation,
    ...(!Object.values(sanitizedAddress).every((prop) => prop === undefined) && {
      address: sanitizedAddress,
    }),
  };
};

export const validateLocation = async (location: any) => {
  let addressSchema = object({
    road: string().max(100),
    houseNo: string().max(5),
    postcode: string().max(7),
    city: string().max(100),
    suburb: string().max(100),
  });

  let locationSchema = object({
    id: string().length(24),
    name: string().max(50),
    description: string().max(500),
    infos: string().max(500),
    tel: string().max(20),
    tags: array(string().max(20)).max(6).nullable(),
    images: array().max(4),
    maxCapacity: number().max(999),
    latitude: number().min(-90).max(90),
    longitude: number().min(-180).max(180),
    indoor: bool(),
    outdoor: bool(),
    noGo: bool(),
  });

  const validatedLocation = await locationSchema.validate(location);
  const validatedAddress = await addressSchema.validate(location?.address);

  return {
    ...validatedLocation,
    ...(!Object.values(validatedAddress).every((prop) => prop === undefined) && {
      address: validatedAddress,
    }),
  };
};
