import { object, string, number, array, bool } from "yup";

export const sanitizeLocation = (location: any) => {
  const sanitizedAddress = {
    road: location?.address?.road?.toString().trim() || location?.road?.toString().trim() || "",
    houseNo: location?.address?.houseNo?.toString().trim() || location?.houseNo?.toString().trim() || "",
    postcode: location?.address?.postcode?.toString().trim() || location?.postcode?.toString().trim() || "",
    city: location?.address?.city?.toString().trim() || location?.city?.toString().trim() || "",
    suburb: location?.address?.suburb?.toString().trim() || location?.suburb?.toString().trim() || "",
  };

  const sanitizedLocation = {
    id: location?._id?.toString().trim() || location?.id?.toString().trim() || undefined,
    teamId: location?.teamId?.toString().trim() || undefined,
    name: location?.name?.toString().trim() || "",
    description: location?.description?.toString().trim() || "",
    infos: location?.infos?.toString().trim() || "",
    tel: location?.tel?.toString().trim() || "",
    maxCapacity: location?.maxCapacity || null,
    latitude: location?.latitude || null,
    longitude: location?.longitude || null,
    indoor: location?.indoor || false,
    outdoor: location?.outdoor || false,
    noGo: location?.noGo || false,
    tags: location?.tags?.length > 0 ? location.tags : [],
    images: location?.images?.length > 0 ? location.images : [],
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
    teamId: string().length(24),
    name: string().max(50),
    description: string().max(1000),
    infos: string().max(1000),
    tel: string().max(20),
    tags: array(string().length(24)).max(6).nullable(),
    images: array().max(4).nullable(),
    maxCapacity: number().max(999).nullable(),
    latitude: number().min(-90).max(90).nullable(),
    longitude: number().min(-180).max(180).nullable(),
    indoor: bool(),
    outdoor: bool(),
    noGo: bool(),
  });

  const [validatedLocation, validatedAddress] = await Promise.all([
    locationSchema.validate(location),
    addressSchema.validate(location?.address),
  ]);

  return {
    ...validatedLocation,
    address: validatedAddress,
  };
};
