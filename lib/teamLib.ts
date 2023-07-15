export const getTeamByName = async (teamName: string): Promise<any> => {
  const sanitizedTeamName = teamName.replaceAll(" ", "+");
  const response = await fetch(`/api/teams/search?teamname=${sanitizedTeamName}`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};

export const getTeamByInvitedEmail = async (eMail: string): Promise<any> => {
  const response = await fetch(`/api/teams/search?invitedemail=${eMail}`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};
