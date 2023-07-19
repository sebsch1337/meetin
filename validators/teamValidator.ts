import { object, string, array } from "yup";

export const sanitizeTeam = (team: any) => {
  const sanitizedInvitation = {
    email: team?.invitedEmails?.email?.toString().trim() || "",
    role: team?.invitedEmails?.role?.toString().trim() || "",
  };

  const sanitizedTeam = {
    id: team?._id?.toString().trim() || team?.id?.toString().trim() || undefined,
    name: team?.name?.trim() || "",
    invitedEmails: team?.invitedEmails || {},
    admins: team?.admins || [],
    users: team?.users || [],
  };

  return { ...sanitizedTeam, invitedEmails: { ...sanitizedInvitation } };
};

export const validateTeam = async (team: any) => {
  let teamInvitationSchema = object({
    email: string().max(100),
    role: string(),
  });

  let teamSchema = object({
    id: string().length(24),
    name: string().max(50),
    admins: array(string().length(24)).max(20).nullable(),
    users: array(string().length(24)).max(20).nullable(),
  });

  const [validatedTeam, validatedTeamInvitation] = await Promise.all([
    teamSchema.validate(team),
    teamInvitationSchema.validate(team?.invitedEmails),
  ]);

  return { ...validatedTeam, invitedEmails: [validatedTeamInvitation] };
};
