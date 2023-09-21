import { sanitizeTeam, validateTeam } from "@/validators/teamValidator";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

/**
 * Retrieves team information from the API based on the provided team ID.
 *
 * @param teamId - The ID of the team to fetch from the API.
 * @returns {Promise<any>} A Promise that resolves to the data of the team if found in the API response.
 *                        The function makes a GET request to the API using the provided teamId and returns the data obtained.
 *                        If the team with the given ID is not found, the Promise resolves to undefined.
 */
export const getTeamById = async (teamId: string): Promise<Team> => {
  const sanitizedInput = await validateTeam(sanitizeTeam({ id: teamId }));

  const response = await fetch(`/api/teams/search?teamid=${sanitizedInput.id}`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};

/**
 * Retrieves a team from the API based on the provided team name.
 *
 * @param teamName The name of the team used to search for the team.
 * @returns A Promise that resolves to the team data retrieved from the API.
 */
export const getTeamByName = async (teamName: string): Promise<Team> => {
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
export const getTeamByInvitedEmail = async (eMail: string): Promise<Team> => {
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
export const createInvitation = async (eMail: string, role: string): Promise<Team["invitedEmails"]> => {
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
      return data.invitedEmails;
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
};

/**
 * Sends a request to accept an invitation to join a team by making a POST request to the API.
 *
 * @returns {Promise<any>} A Promise that resolves to the data returned by the API if the invitation acceptance is successful.
 *                        If the API response is successful, it shows a success notification with the team join message and icon.
 *                        If the API response is not successful, it shows an error notification.
 *                        If the API response is not successful, the Promise resolves to false.
 */
export const acceptInvitation = async (): Promise<void> => {
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
    return;
  }

  notifications.show({
    icon: <IconX />,
    color: "red",
    title: "Teameinladung",
    message: "Fehler beim Teambeitritt.",
  });
  throw new Error();
};

/**
 * Sends a request to decline an invitation to join a team by making a POST request to the API.
 *
 * @returns A Promise that resolves to a boolean value indicating if the invitation was declined successfully.
 *          - If the response from the API is successful, the Promise resolves to true.
 *          - If the response from the API is not successful, the Promise resolves to false.
 */
export const declineInvitation = async (eMail: string): Promise<InvitedEmails[]> => {
  const response = await fetch(`/api/teams/invitation`, {
    method: "POST",
    body: JSON.stringify({ type: "decline", eMail }),
  });

  if (response.ok) {
    const data = await response.json();

    let deleteMessage = "Einladung abgelehnt.";
    if (eMail) {
      deleteMessage = "Einladung zurückgezogen.";
    }

    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      title: "Teameinladung",
      message: deleteMessage,
    });

    return data.invitedEmails;
  }

  return [];
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

/**
 * Sends a request to remove a user from a team by making a DELETE request to the API endpoint.
 *
 * @param userId - The ID of the user to be removed from the team.
 * @returns {Promise<boolean>} A Promise that resolves to a boolean value indicating if the user was successfully removed from the team.
 *                            If the API response is successful, the Promise resolves to `true`, and a success notification is shown.
 *                            If the API response is not successful, the Promise resolves to `false`, and an error notification is shown.
 */
export const removeUserFromTeam = async (userId: string): Promise<boolean> => {
  const response = await fetch(`/api/teams/remove-user/${userId}`, {
    method: "DELETE",
  });

  if (response.status === 200) {
    const data = await response.json();

    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      title: "Teamverwaltung",
      message: `Benutzer wurde aus Team entfernt.`,
    });

    return true;
  } else {
    notifications.show({
      icon: <IconX />,
      color: "red",
      title: "Teamverwaltung",
      message: `Der einzige Admin kann nicht entfernt werden.`,
    });

    return false;
  }
};

/**
 * Retrieves users and admins for a given team ID from the server.
 *
 * @param {string} teamId - The ID of the team to fetch users and admins for.
 * @returns {Promise<false | UserData[]>} A Promise that resolves to an array of UserData or false if the request fails.
 */
export const getUsersAndAdminsForTeamId = async (teamId: string): Promise<Member[]> => {
  const response = await fetch(`/api/teams/users`, {
    method: "GET",
  });

  if (response.ok) {
    const userData = await response.json();
    return userData;
  } else {
    return [];
  }
};

/**
 * Retrieves users and admins for a given team ID from the server.
 *
 * @param {string} teamId - The ID of the team to fetch users and admins for.
 * @returns {Promise<false | UserData[]>} A Promise that resolves to an array of UserData or false if the request fails.
 */
export const changeUserRole = async (userId: string, role: string): Promise<boolean> => {
  const response = await fetch(`/api/teams/users`, {
    method: "POST",
    body: JSON.stringify({ userId, role }),
  });

  if (response.ok) {
    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      title: "Teamverwaltung",
      message: `Rolle erfolgreich geändert.`,
    });

    return true;
  }

  notifications.show({
    icon: <IconX />,
    color: "red",
    title: "Teamverwaltung",
    message: `Fehler beim Ändern der Rolle.`,
  });

  return false;
};

/**
 * Deletes a team with the specified teamId from the server.
 *
 * @param teamId The ID of the team to delete.
 * @returns A Promise that resolves to a boolean value:
 * - `true` if the team was deleted successfully.
 * - `false` if there was an error while deleting the team.
 */
export const deleteTeam = async (teamId: string): Promise<boolean> => {
  const response = await fetch(`/api/teams/${teamId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    return true;
  }

  notifications.show({
    icon: <IconX />,
    color: "red",
    title: "Teamverwaltung",
    message: `Fehler beim Löschen des Teams.`,
  });

  return false;
};
