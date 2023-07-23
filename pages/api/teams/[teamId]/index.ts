import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { getUserRoleInTeamFromDb } from "@/services/userService";
import { deleteTeamInDb } from "@/services/teamService";

export default async function handler(req: any, res: any): Promise<any> {
  const {
    query: {},
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "unauthorized" });

  const role = await getUserRoleInTeamFromDb(session.user?.id, session.user?.teamId);

  try {
    switch (method) {
      case "DELETE":
        if (role !== "admin") return res.status(403).json({ message: "forbidden" });
        await deleteTeamInDb(session?.user?.teamId);
        res.status(200).json({ message: "Team deleted" });
        break;

      default:
        res.status(405).json({ error: "Method not allowed" });
        break;
    }
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error(error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}
