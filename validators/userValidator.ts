import { object, string } from "yup";

export const sanitizeUser = (user: any) => {
  const sanitizedUser = {
    id: user?._id?.toString().trim() || user?.id?.toString().trim() || undefined,
    name: user?.name?.trim() || "",
    email: user?.email || "",
  };

  return sanitizedUser;
};

export const validateUser = async (user: any) => {
  let userSchema = object({
    id: string().length(24),
    name: string().max(50),
    email: string().max(50),
  });

  const validatedUser = await userSchema.validate(user);

  return validatedUser;
};
