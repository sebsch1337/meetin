import { object, string, array } from "yup";

export const sanitizeTeam = (team: any) => {
  const sanitizedTeam = {
    id: team?._id?.toString().trim() || team?.id?.toString().trim() || undefined,
    name: team?.name?.trim() || "",
    invitedEmails: team?.invitedEmails || [],
    admins: team?.admins || [],
    users: team?.users || [],
  };

  return sanitizedTeam;
};

export const validateTeam = async (team: any) => {
  let teamSchema = object({
    id: string().length(24),
    name: string().max(50),
    invitedEmails: array(string().max(100)).max(20).nullable(),
    admins: array(string().length(24)).max(20).nullable(),
    users: array(string().length(24)).max(20).nullable(),
  });

  const validatedTeam = await teamSchema.validate(team);

  return validatedTeam;
};
