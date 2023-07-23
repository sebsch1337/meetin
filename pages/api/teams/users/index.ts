import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

import { changeUserRoleInDb, getUsersAndAdminsForTeamFromDb } from "@/services/teamService";
import { getUserRoleInTeamFromDb } from "@/services/userService";

export default async function handler(req: any, res: any): Promise<any> {
  const {
    query: {},
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "unauthorized" });

  const role = await getUserRoleInTeamFromDb(session.user?.id, session.user?.teamId);
  if (role !== "admin") return res.status(403).json({ message: "forbidden" });

  try {
    switch (method) {
      case "GET":
        const users = await getUsersAndAdminsForTeamFromDb(session?.user?.teamId);
        return res.status(200).json(users);

      case "POST":
        const removedSuccess = await changeUserRoleInDb(req.body.userId, req.body.role);
        return res.status(200).json({ message: `Changing role successfully: ${removedSuccess}` });

      default:
        res.status(405).json({ error: "Method not allowed" });
        break;
    }
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
