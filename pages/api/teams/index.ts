import { createTeamInDb, getAllTeamsFromDb } from "@/services/teamService";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: any, res: any): Promise<any> {
  const {
    query: {},
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session?.user) return res.status(401).json({ message: "unauthorized" });

  try {
    switch (method) {
      case "GET":
        const teams = await getAllTeamsFromDb();
        res.status(200).json(teams);
        break;

      case "POST":
        const teamData = JSON.parse(req.body);
        const team = await createTeamInDb(teamData.teamName, session.user.id);
        res.status(200).json(team);
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
