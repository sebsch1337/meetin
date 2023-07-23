import dbConnect from "../lib/dbConnect";
import { Types } from "mongoose";

import { sanitizeUser, validateUser } from "@/validators/userValidator";
import { sanitizeTeam, validateTeam } from "@/validators/teamValidator";

import { setUserTeamInDb } from "./userService";

import Users from "@/models/usersModel";
import Teams from "@/models/teamsModel";
import Locations from "@/models/locationsModel";
import Events from "@/models/eventsModel";

import { deleteLocationFromDb } from "./locationService";

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
export async function getTeamByIdFromDb(teamId: any): Promise<any> {
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
 * Changes the role of a user in the database by moving the userId from one role to another role in the teams collection.
 * @param userId The ID of the user whose role needs to be changed.
 * @param role The new role to assign to the user. Must be either "admins" or "users".
 * @returns A Promise that resolves to true if the user's role is successfully changed, or an Error object if any error occurs.
 * @throws An Error if userId or role is not provided, if the team is not found for the given user, or if an invalid role is provided.
 */
export async function changeUserRoleInDb(userId: string, role: string): Promise<boolean | Error> {
  const sanitizedInput = await validateUser(sanitizeUser({ id: userId, role }));

  if (!sanitizedInput.id || !sanitizedInput.role) {
    const error: any = new Error("User or role not given");
    error.status = 404;
    throw error;
  }

  await dbConnect();

  const team = await Teams.findOne({ $or: [{ admins: sanitizedInput.id }, { users: sanitizedInput.id }] }).exec();

  if (!team) {
    const error: any = new Error("Team not found for the given user");
    error.status = 404;
    throw error;
  }

  if (team.admins.includes(sanitizedInput.id)) {
    if (team.admins.length === 1) {
      const error: any = new Error("Removal of last remaining admin not allowed");
      error.status = 403;
      throw error;
    }
    team.admins.pull(sanitizedInput.id);
  } else {
    team.users.pull(sanitizedInput.id);
  }

  if (sanitizedInput.role === "admin") {
    team.admins.push(sanitizedInput.id);
  } else if (sanitizedInput.role === "user") {
    team.users.push(sanitizedInput.id);
  } else {
    const error: any = new Error('Invalid role. Use "admin" or "user".');
    error.status = 400;
    throw error;
  }

  await team.save();

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
export async function getUsersAndAdminsForTeamFromDb(teamId: any): Promise<any[]> {
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

/**
 * Deletes an email address from the "invitedEmails" field of a team in the database.
 *
 * @param invitedEmail - The email address of the user to be deleted from invitations.
 * @returns The updated team object after the email address has been removed.
 * @throws Error with status code 404 if:
 *   - The user with the given email address is not found in the database.
 *   - The team containing the email address in "invitedEmails" is not found.
 *   - The invited user with the given email address is not found in the team's "invitedEmails" array.
 */
export async function deleteEmailFromInvitationsInDb(invitedEmail: any) {
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

/**
 * Removes a user with the given `userId` from the specified team in the database.
 * The function updates both the `admins` and `users` arrays in the team document.
 * Additionally, it removes the `teamId` field from the user's document in the `Users` collection.
 *
 * @param teamId - The ID of the team from which the user will be removed.
 * @param userId - The ID of the user to be removed from the team.
 * @returns {Promise<boolean>} A Promise that resolves to `true` if the user was successfully removed from the team.
 *                            If the team with the given ID is not found, the Promise resolves to `false`.
 *                            If an error occurs during the removal process, the Promise also resolves to `false`.
 * @throws Error with status code 404 if the team with the given ID is not found.
 */
export async function removeUserIdFromTeamInDb(teamId: any, userId: string): Promise<boolean> {
  await dbConnect();

  const sanitizedTeamId = new Types.ObjectId(teamId);
  const sanitizedUserId = new Types.ObjectId(userId);

  try {
    const team = await Teams.findOne({ _id: sanitizedTeamId }).exec();

    if (!team) {
      const error: any = new Error("Team not found.");
      error.status = 404;
      throw error;
    }

    if (team.admins.includes(userId)) {
      team.admins = team.admins.filter((adminId: string) => adminId.toString() !== userId);
    }

    if (team.users.includes(userId)) {
      team.users = team.users.filter((userId: string) => userId.toString() !== userId);
    }

    await team.save();

    await Users.updateOne({ _id: sanitizedUserId }, { $unset: { teamId: 1 } });

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Deletes a team from the database based on the provided teamId.
 *
 * @param {any} teamId - The ID of the team to be deleted.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the team is deleted successfully, false otherwise.
 */
export async function deleteTeamInDb(teamId?: string): Promise<boolean> {
  await dbConnect();

  const sanitizedTeam = await validateTeam(sanitizeTeam({ id: teamId }));

  const [deletedTeam, deletedEvents, teamUsers, teamLocations] = await Promise.all([
    Teams.findOneAndDelete({ _id: sanitizedTeam.id }).exec(),
    Events.deleteMany({ teamId: sanitizedTeam.id }).exec(),
    Users.updateMany({ teamId: sanitizedTeam.id }, { $unset: { teamId: 1 } }),
    Locations.find({ teamId: sanitizedTeam.id }).exec(),
  ]);

  await Promise.all(teamLocations.map((location) => deleteLocationFromDb(location.id, sanitizedTeam.id)));

  return true;
}
