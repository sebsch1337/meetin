import { sanitizeUser, validateUser } from "@/validators/userValidator";
import dbConnect from "../lib/dbConnect";
import Users from "@/models/usersModel";
import Teams from "@/models/teamsModel";

/**
 * Updates the teamId for a user in the database.
 * @param {string} eMail - The email of the user to update.
 * @param {string} teamId - The new teamId value to set for the user.
 * @returns {Promise<void>} A Promise that resolves when the user's teamId has been updated in the database.
 */
export async function setUserTeamInDb(userId: string, teamId: string): Promise<void> {
  await dbConnect();

  const sanitizedInput = await validateUser(sanitizeUser({ id: userId, teamId }));
  const user: any = await Users.updateOne({ _id: sanitizedInput.id }, { $set: { teamId } }).exec();
}

/**
 * Get the role of a user (admin or user) in a specific team from the database.
 * @param userId - The ID of the user.
 * @param teamId - The ID of the team.
 * @returns The user's role (admin, user) in the specified team, or an empty string if the user is not found in the team.
 */
export async function getUserRoleInTeamFromDb(userId: any, teamId: any): Promise<any> {
  const team = await Teams.findById(teamId);
  if (!team) return "";

  if (team.admins.includes(userId)) {
    return "admin";
  } else if (team.users.includes(userId)) {
    return "user";
  } else {
    return "";
  }
}
