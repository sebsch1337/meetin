import { getTeamByNameFromDb } from "@/services/teamService";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req: any, res: any): Promise<any> {
  const {
    query: { teamname },
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "unauthorized" });

  switch (method) {
    case "GET":
      try {
        if (teamname) {
          const team = await getTeamByNameFromDb(teamname);
          return res.status(200).json(team);
        }
        return res.status(400).json({ error: "Bad request" });
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
