import { getAllLocationsFromDb, postLocationToDb } from "@/services/locationService";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: any, res: any): Promise<any> {
  const {
    query: {},
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "unauthorized" });

  switch (method) {
    case "GET":
      try {
        const locations = await getAllLocationsFromDb();
        res.status(200).json(locations);
      } catch (error: any) {
        if (error.status) {
          return res.status(error.status).json({ message: error.message });
        }
        console.error(error.message);
        return res.status(500).json({ message: "internal server error" });
      }
      break;

    case "POST":
      try {
        const postedLocation: any = await postLocationToDb(req.body);
        res.status(200).json(postedLocation);
      } catch (error: any) {
        if (error.status) {
          return res.status(error.status).json({ message: error.message });
        }
        console.error(error.message);
        return res.status(500).json({ message: "internal server error" });
      }
      break;

    default:
      res.status(405).json({ error: "Method not allowed" });
      break;
  }
}
