import { sanitizeUser, validateUser } from "@/validators/userValidator";
import dbConnect from "../lib/dbConnect";
import Teams from "../models/teamsModel";
import { sanitizeTeam, validateTeam } from "@/validators/teamValidator";
import { setUserTeamInDb } from "./userService";
import Email from "next-auth/providers/email";

/**
 * Gets all teams from the database.
 *
 * @returns An array of sanitized and validated team objects.
 * @throws Error if the team array is not found or not an array.
 */
export async function getAllTeamsFromDb(): Promise<Team[]> {
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
export async function getTeamByIdFromDb(teamId: string): Promise<Team> {
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
export async function getTeamByNameFromDb(teamName: string): Promise<Team> {
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
export async function getTeamByInvitedEmailFromDb(invitedEmail: string): Promise<any> {
  await dbConnect();

  const sanitizedInput = await validateUser(sanitizeUser({ email: invitedEmail }));

  const team = await Teams.findOne({ "invitedEmails.email": sanitizedInput.email });

  if (!team) {
    console.log("Team not found.");
    return false;
  }

  const sanitizedTeam = await validateTeam(sanitizeTeam(team));

  return sanitizedTeam;
}

// /**
//  * Sets an invited email as a team user in the database.
//  * @param {string} invitedEmail - The email of the invited user.
//  * @returns {Promise<boolean>} A Promise that resolves to true if the email is successfully set as a team user, false otherwise.
//  */
// export async function addUserToTeamInDb(invitedEmail: string, userId: string): Promise<boolean> {
//   await dbConnect();

//   const sanitizedInput = await validateUser(sanitizeUser({ id: userId, email: invitedEmail }));

//   const team: any = await Teams.findOne({ invitedEmails: sanitizedInput?.email }).exec();

//   if (team) {
//     const userIndex = team.invitedEmails.indexOf(sanitizedInput?.email);
//     if (userIndex !== -1) {
//       team.invitedEmails.splice(userIndex, 1);
//       team.users.push(sanitizedInput.id);
//       await team.save();

//       if (sanitizedInput?.id) {
//         await setUserTeamInDb(sanitizedInput?.id, team.id);
//         return true;
//       }
//     }
//   }

//   return false;
// }

/**
 * Adds a user to a team in the database based on the invited email and user ID.
 * @param invitedEmail The email of the invited user.
 * @param userId The ID of the user to be added.
 * @returns A Promise that resolves to a boolean value indicating the success of the operation.
 */
export async function addUserToTeamInDb(invitedEmail: string, userId: string): Promise<boolean> {
  await dbConnect();

  try {
    const sanitizedInput = await validateUser(sanitizeUser({ id: userId, email: invitedEmail }));

    if (!sanitizedInput.id || !sanitizedInput.email) {
      throw new Error("User not found");
    }

    const team = await Teams.findOne({ "invitedEmails.email": sanitizedInput.email }).exec();
    if (!team) {
      throw new Error("Team not found");
    }

    const invitedUserIndex = team.invitedEmails.findIndex((user: any) => user.email === sanitizedInput.email);
    if (invitedUserIndex === -1) {
      throw new Error("Invited user not found");
    }

    const { role } = team.invitedEmails[invitedUserIndex];
    if (role === "admin") {
      team.admins.push(sanitizedInput.id);
    } else if (role === "user") {
      team.users.push(sanitizedInput.id);
    } else {
      throw new Error("Invalid role");
    }

    team.invitedEmails.splice(invitedUserIndex, 1);

    await team.save();
    await setUserTeamInDb(sanitizedInput.id, team.id);
  } catch (error) {
    console.error("An error occurred:", error);
    return false;
  }

  return true;
}

/**
 * Creates a new team in the database.
 *
 * @param teamName - The name of the team to be created.
 * @param userId - The ID of the user creating the team.
 * @returns A Promise that resolves to a `Team` object representing the created team.
 */
export async function createTeamInDb(teamName: any, userId: string | undefined): Promise<Team | object> {
  if (!teamName || !userId) return {};
  await dbConnect();

  const sanitizedInput = await validateTeam(sanitizeTeam({ name: teamName, admins: [userId] }));
  const team: any = await Teams.create({ name: sanitizedInput.name, admins: sanitizedInput.admins });
  const sanitizedTeam = await validateTeam(sanitizeTeam(team));
  const sanitizedUser = await validateUser(sanitizeUser({ id: userId }));
  if (sanitizedUser?.id) {
    await setUserTeamInDb(sanitizedUser?.id, team.id);
  }

  return sanitizedTeam;
}
