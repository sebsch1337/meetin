import { object, string } from "yup";

export const sanitizeTag = (tag: any) => {
  const sanitizedTag = {
    id: tag?._id?.toString().trim() || tag?.id?.toString().trim() || undefined,
    name: tag?.name || "",
  };

  return sanitizedTag;
};

export const validateTag = async (tag: any) => {
  let tagSchema = object({
    id: string().length(24),
    name: string().max(20),
  });

  const validatedTag = await tagSchema.validate(tag);

  return validatedTag;
};
