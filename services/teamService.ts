import { sanitizeUser, validateUser } from "@/validators/userValidator";
import dbConnect from "../lib/dbConnect";
import Teams from "../models/teamsModel";
import { sanitizeTeam, validateTeam } from "@/validators/teamValidator";
import { setUserTeamInDb } from "./userService";
import Email from "next-auth/providers/email";
import Users from "@/models/usersModel";

/**
 * Gets all teams from the database.
 *
 * @returns An array of sanitized and validated team objects.
 * @throws Error if the team array is not found or not an array.
 */
export async function getAllTeamsFromDb(): Promise<any[]> {
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
export async function getTeamByInvitedEmailFromDb(invitedEmail: string): Promise<any> {
  await dbConnect();

  const sanitizedInput = await validateUser(sanitizeUser({ email: invitedEmail }));

  const team = await Teams.findOne({ "invitedEmails.email": sanitizedInput.email });

  if (!team) {
    console.error("Team not found.");
    return false;
  }

  const sanitizedTeam = await validateTeam(sanitizeTeam(team));

  return sanitizedTeam;
}

/**
 * Add an email with role to the invitedEmails array of a specific team.
 * @param teamId - The ID of the team.
 * @param email - The email address to add to the invitedEmails array.
 * @param role - The role associated with the email address.
 * @returns The updated team object.
 * @throws Error if the team is not found in the database or if there's a permission / existing email problem.
 */
export async function addEmailToInvitedEmailsInDb(invitedEmail: string, invitedRole: string, teamId: any, securityRole: string) {
  await dbConnect();

  try {
    if (securityRole !== "admin") {
      const error: any = new Error("User is not permitted to invite members");
      error.status = 403;
      throw error;
    }

    const sanitizedInput = await validateUser(sanitizeUser({ email: invitedEmail, role: invitedRole, teamId }));

    const [existingEmail, existingEmailInUsers, team] = await Promise.all([
      Teams.findOne({ "invitedEmails.email": sanitizedInput.email }).exec(),
      Users.findOne({ email: sanitizedInput.email }).exec(),
      Teams.findById(sanitizedInput.teamId).exec(),
    ]);

    if (existingEmail || existingEmailInUsers) {
      const error: any = new Error("Email address already exists");
      error.status = 409;
      throw error;
    }

    if (!team) {
      const error: any = new Error("Team not found");
      error.status = 404;
      throw error;
    }

    team.invitedEmails.push({ email: sanitizedInput.email, role: sanitizedInput.role });
    await team.save();
    return team;
  } catch (error) {
    throw error;
  }
}

/**
 * Adds a user to a team in the database based on the invited email and user ID.
 * @param invitedEmail The email of the invited user.
 * @param userId The ID of the user to be added.
 * @returns A Promise that resolves to a boolean value indicating the success of the operation.
 */
export async function addUserToTeamInDb(invitedEmail: string, userId: string): Promise<boolean> {
  await dbConnect();

  const sanitizedInput = await validateUser(sanitizeUser({ id: userId, email: invitedEmail }));

  if (!sanitizedInput.id || !sanitizedInput.email) {
    const error: any = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const team = await Teams.findOne({ "invitedEmails.email": sanitizedInput.email }).exec();
  if (!team) {
    const error: any = new Error("Team not found");
    error.status = 404;
    throw error;
  }

  const invitedUserIndex = team.invitedEmails.findIndex((user: any) => user.email === sanitizedInput.email);
  if (invitedUserIndex === -1) {
    const error: any = new Error("Invited user not found");
    error.status = 404;
    throw error;
  }

  const { role } = team.invitedEmails[invitedUserIndex];
  if (role === "admin") {
    team.admins.push(sanitizedInput.id);
  } else if (role === "user") {
    team.users.push(sanitizedInput.id);
  } else {
    const error: any = new Error("Invalid role");
    error.status = 400;
    throw error;
  }

  team.invitedEmails.splice(invitedUserIndex, 1);

  await team.save();
  await setUserTeamInDb(sanitizedInput.id, team.id);

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

/**
 * Retrieves and sanitizes user data for a specific team from the database.
 * @param {string} teamId - The unique identifier of the team for which users are to be fetched.
 * @returns {Promise<any[]>} - A promise that resolves to an array of sanitized user data.
 * @throws {Error} - If the team with the given `teamId` is not found in the database.
 */
export async function getUsersAndAdminsForTeamFromDb(teamId: string): Promise<any[]> {
  await dbConnect();

  const team = await Teams.findOne({ _id: teamId }).exec();
  if (!team) {
    throw new Error(`Team with ID '${teamId}' not found.`);
  }

  const adminUsers = await Users.find({ _id: { $in: team.admins }, teamId }).exec();
  const userUsers = await Users.find({ _id: { $in: team.users }, teamId }).exec();

  const usersWithRole: any[] = [
    ...adminUsers.map((admin) => ({ ...admin.toObject(), role: "admin" })),
    ...userUsers.map((user) => ({ ...user.toObject(), role: "user" })),
  ];

  const sanitizedInput = await Promise.all(usersWithRole.map(async (user) => await validateUser(sanitizeUser(user))));
  return sanitizedInput;
}

export async function deleteEmailFromInvitationsInDb(invitedEmail: string) {
  await dbConnect();

  const sanitizedInput = await validateUser(sanitizeUser({ email: invitedEmail }));

  if (!sanitizedInput.email) {
    const error: any = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const team = await Teams.findOne({ "invitedEmails.email": sanitizedInput.email }).exec();
  if (!team) {
    const error: any = new Error("Team not found");
    error.status = 404;
    throw error;
  }

  const invitedUserIndex = team.invitedEmails.findIndex((user: any) => user.email === sanitizedInput.email);
  if (invitedUserIndex === -1) {
    const error: any = new Error("Invited user not found");
    error.status = 404;
    throw error;
  }

  team.invitedEmails.splice(invitedUserIndex, 1);
  await team.save();

  return team;
}
