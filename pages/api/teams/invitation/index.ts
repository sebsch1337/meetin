import { addEmailToInvitedEmailsInDb, getTeamByInvitedEmailFromDb, getTeamByNameFromDb } from "@/services/teamService";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { getUserRoleInTeamFromDb } from "@/services/userService";

export default async function handler(req: any, res: any): Promise<any> {
  const {
    query: { teamname, invitedemail },
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
