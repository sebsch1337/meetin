import { removeUserIdFromTeamInDb } from "@/services/teamService";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { getUserRoleInTeamFromDb } from "@/services/userService";

export default async function handler(req: any, res: any): Promise<any> {
  const {
    query: { userId },
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.teamId) return res.status(401).json({ message: "unauthorized" });

  const role = await getUserRoleInTeamFromDb(session.user?.id, session.user?.teamId);
  if (role !== "admin") return res.status(403).json({ message: "forbidden" });

  switch (method) {
    case "DELETE":
      try {
        const removedUser = await removeUserIdFromTeamInDb(session.user.teamId, userId);
        return res.status(200).json({ deleted: removedUser });
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
