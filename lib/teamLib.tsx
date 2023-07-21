import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

/**
 * Retrieves a team from the API based on the provided team name.
 *
 * @param teamName The name of the team used to search for the team.
 * @returns A Promise that resolves to the team data retrieved from the API.
 */
export const getTeamByName = async (teamName: string): Promise<any> => {
  const sanitizedTeamName = teamName.replaceAll(" ", "+");
  const response = await fetch(`/api/teams/search?teamname=${sanitizedTeamName}`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};

/**
 * Retrieves a team from the API based on the provided invited email address.
 *
 * @param eMail The email address used to search for the team invitation.
 * @returns A Promise that resolves to the team data retrieved from the API.
 */
export const getTeamByInvitedEmail = async (eMail: string): Promise<any> => {
  const response = await fetch(`/api/teams/search?invitedemail=${eMail}`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};

/**
 * Creates an invitation for a team member.
 *
 * @param eMail The email address of the invited team member.
 * @param role The role of the invited team member.
 * @returns If the invitation is successfully created, returns the response data from the server.
 *          Otherwise, returns `false` and displays an error notification.
 */
export const createInvitation = async (eMail: string, role: string): Promise<any> => {
  const response = await fetch(`/api/teams/invitation`, {
    method: "POST",
    body: JSON.stringify({ type: "create", eMail, role }),
  });

  if (response.ok) {
    const data = await response.json();

    if (data.invitedEmails.length > 0) {
      notifications.show({
        icon: <IconCheck />,
        color: "teal",
        title: "Teameinladung",
        message: `${eMail} erfolgreich eingladen.`,
      });
      return data;
    }
  }

  let errorMessage = "Fehler beim Einladen der E-Mail Adresse.";
  if (response.status === 409) errorMessage = "E-Mail Adresse existiert bereits.";

  notifications.show({
    icon: <IconX />,
    color: "red",
    title: eMail,
    message: errorMessage,
  });
  return false;
};

export const acceptInvitation = async (): Promise<any> => {
  const response = await fetch(`/api/teams/invitation`, {
    method: "POST",
    body: JSON.stringify({ type: "accept" }),
  });

  if (response.ok) {
    const data = await response.json();

    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      title: "Teameinladung",
      message: `Team erfolgreich beigetreten.`,
    });

    return data;
  }

  notifications.show({
    icon: <IconX />,
    color: "red",
    title: "Teameinladung",
    message: "Fehler beim Teambeitritt.",
  });
  return false;
};

export const declineInvitation = async (): Promise<boolean> => {
  const response = await fetch(`/api/teams/invitation`, {
    method: "POST",
    body: JSON.stringify({ type: "decline" }),
  });

  if (response.ok) {
    const data = await response.json();
    return true;
  }

  return false;
};

/**
 * Creates a new team by making a POST request to the server.
 * @param teamName - The name of the team.
 * @returns A Promise that resolves to a boolean indicating the success of the team creation.
 */
export const createTeam = async (teamName: string): Promise<boolean> => {
  const response = await fetch(`/api/teams/`, {
    method: "POST",
    body: JSON.stringify({ teamName }),
  });

  if (response.ok) {
    const data = await response.json();

    if (data.name) {
      notifications.show({
        icon: <IconCheck />,
        color: "teal",
        title: data.name,
        message: `Team erfolgreich erstellt.`,
      });

      return true;
    }
  }

  notifications.show({
    icon: <IconX />,
    color: "red",
    title: teamName,
    message: `Fehler beim Erstellen des Teams.`,
  });

  return false;
};
