import { sanitizeUser, validateUser } from "@/validators/userValidator";
import dbConnect from "../lib/dbConnect";
import Users from "@/models/usersModel";

/**
 * Updates the teamId for a user in the database.
 * @param {string} eMail - The email of the user to update.
 * @param {string} teamId - The new teamId value to set for the user.
 * @returns {Promise<void>} A Promise that resolves when the user's teamId has been updated in the database.
 */
export async function setUserTeamInDb(eMail: string, teamId: string): Promise<void> {
  await dbConnect();

  const sanitizedInput = await validateUser(sanitizeUser({ teamId }));

  const user: any = await Users.updateOne({ email: eMail }, { $set: { teamId } }).exec();
}
