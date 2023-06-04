import { deleteEventFromDb, updateEventInDb } from "@/services/eventService";

export default async function handler(req: any, res: any): Promise<any> {
  const {
    query: { eventId },
    method,
  } = req;

  switch (method) {
    case "PATCH":
      try {
        const updatedEvent = await updateEventInDb(eventId, req.body.values);
        res.status(200).json(updatedEvent);
      } catch (error: any) {
        if (error.status) {
          return res.status(error.status).json({ message: error.message });
        }
        console.error(error.message);
        return res.status(500).json({ message: "internal server error" });
      }
      break;

    case "DELETE":
      try {
        const deletedEvent: any = await deleteEventFromDb(eventId);
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
