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
 * Sends a GET request to accept an invitation through the /api/teams/acceptInvitation endpoint.
 * @returns {Promise<any>} A Promise that resolves to the response data from the server.
 */
export const acceptInvitation = async (): Promise<any> => {
  const response = await fetch(`/api/teams/acceptInvitation`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};
