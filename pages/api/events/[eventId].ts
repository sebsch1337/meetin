import { deleteEventFromDb, updateEventInDb } from "@/services/eventService";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: any, res: any): Promise<any> {
  const {
    query: { eventId },
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session?.user?.teamId) return res.status(401).json({ message: "unauthorized" });

  switch (method) {
    case "PATCH":
      try {
        const updatedEvent = await updateEventInDb(eventId, req.body.values, session.user.teamId);
        res.status(200).json(updatedEvent);
      } catch (error: any) {
        if (error.status) {
          return res.status(error.status).json({ message: error.message });
        }
        if (error.errors) {
          console.error(error.errors);
          return res.status(500).json({ errors: error.errors });
        }
        return res.status(500).json({ message: "internal server error" });
      }
      break;

    case "DELETE":
      try {
        const deletedEvent = await deleteEventFromDb(eventId, session.user.teamId);
        res.status(200).json(deletedEvent);
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
