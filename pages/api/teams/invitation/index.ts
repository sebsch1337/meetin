import { addEmailToInvitedEmailsInDb, addUserToTeamInDb, deleteEmailFromInvitationsInDb } from "@/services/teamService";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { getUserRoleInTeamFromDb } from "@/services/userService";

export default async function handler(req: any, res: any): Promise<any> {
  const {
    query: {},
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "unauthorized" });

  switch (method) {
    case "POST":
      const invitation = await JSON.parse(req.body);
      try {
        if (invitation.type === "create") {
          const userRole = await getUserRoleInTeamFromDb(session?.user?.id, session?.user?.teamId);
          const team = await addEmailToInvitedEmailsInDb(invitation.eMail, invitation.role, session?.user?.teamId, userRole);
          if (!team) {
            const error: any = new Error("Error while creating invitation");
            error.status = 400;
            throw error;
          }
          return res.status(200).json(team);
        }

        if (invitation.type === "accept") {
          const invitationAccepted: boolean = session?.user?.email
            ? await addUserToTeamInDb(session?.user?.email, session?.user?.id)
            : false;
          return res.status(200).json({ message: "Accepted: " + invitationAccepted });
        }

        if (invitation.type === "decline") {
          if (invitation.eMail) {
            const role = await getUserRoleInTeamFromDb(session.user?.id, session.user?.teamId);
            if (role === "admin") {
              const newInvitations = await deleteEmailFromInvitationsInDb(invitation.eMail);
              return res.status(200).json(newInvitations);
            }
          } else {
            await deleteEmailFromInvitationsInDb(session?.user?.email);
            return res.status(200).json({ message: "Invitation declined" });
          }
        }
      } catch (error: any) {
        if (error.status) {
          return res.status(error.status).json({ message: error.message });
        }
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
      }
      break;

    default:
      res.status(405).json({ error: "Method not allowed" });
      break;
  }
}
