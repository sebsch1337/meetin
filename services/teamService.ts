import { sanitizeUser, validateUser } from "@/validators/userValidator";
import dbConnect from "../lib/dbConnect";
import Teams from "../models/teamsModel";
import { sanitizeTeam, validateTeam } from "@/validators/teamValidator";

/**
 * Gets all teams from the database.
 *
 * @returns An array of sanitized and validated team objects.
 * @throws Error if the team array is not found or not an array.
 */
export async function getAllTeamsFromDb(): Promise<any> {
  await dbConnect();

  const teams = await Teams.find({});
  if (!Array.isArray(teams)) {
    const error: any = new Error("No teams found");
    error.status = 404;
    throw error;
  }

  const sanitizedTeams = await Promise.all(teams.map(async (team) => await validateTeam(sanitizeTeam(team))));

  return sanitizedTeams;
}

/**
 * Retrieves an team from the database based on the provided team ID.
 * @param teamId - The ID of the team to retrieve.
 * @returns A promise that resolves to the retrieved team.
 * @throws If the team is not found in the database.
 */
export async function getTeamByIdFromDb(teamId: string): Promise<any> {
  await dbConnect();

  const sanitizedInput = await validateTeam(sanitizeTeam({ id: teamId }));

  const team = await Teams.findById(sanitizedInput.id).exec();
  if (!team) {
    const error: any = new Error("Team not found");
    error.status = 404;
    throw error;
  }

  const sanitizedTeam = await validateTeam(sanitizeTeam(team));

  return sanitizedTeam;
}

/**
 * Retrieves an team from the database based on the provided team name.
 * @param teamName - The name of the team to retrieve.
 * @returns A promise that resolves to the retrieved team.
 * @throws Error if the team is not found in the database.
 */
export async function getTeamByNameFromDb(teamName: string): Promise<any> {
  await dbConnect();

  const sanitizedInput = await validateTeam(sanitizeTeam({ name: teamName.replaceAll("+", " ") }));

  const team: any = await Teams.findOne({ name: { $regex: new RegExp("^" + sanitizedInput?.name?.toLowerCase() + "$", "i") } }).exec();

  if (!team) {
    const error: any = new Error("Team not found");
    error.status = 200;
    throw error;
  }

  const sanitizedTeam = await validateTeam(sanitizeTeam(team));

  return sanitizedTeam;
}

/**
 * Retrieves a team from the database based on the provided invited email address.
 *
 * @param eMail The email address used to search for the team invitation.
 * @returns A Promise that resolves to the sanitized team object.
 * @throws Throws an error if the team invitation is not found.
 */
export async function getTeamByInvitedEmailFromDb(eMail: string): Promise<any> {
  await dbConnect();

  const sanitizedInput = await validateUser(sanitizeUser({ email: eMail }));

  const team: any = await Teams.findOne({ invitedEmails: sanitizedInput?.email }).exec();

  if (!team) {
    const error: any = new Error("Teaminvitation not found");
    error.status = 200;
    throw error;
  }

  const sanitizedTeam = await validateTeam(sanitizeTeam(team));

  return sanitizedTeam;
}
