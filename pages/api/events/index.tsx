import {
  deleteEventFromDb,
  getAllEventsFromDb,
  postEventToDb,
  updateEventInDb,
} from "@/services/eventService";

export default async function handler(req: any, res: any): Promise<any> {
  const {
    query: {},
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const tags = await getAllEventsFromDb();
        res.status(200).json(tags);
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
        const newEvent: any = await postEventToDb(req.body);
        res.status(200).json(newEvent);
      } catch (error: any) {
        if (error.status) {
          return res.status(error.status).json({ message: error.message });
        }
        console.error(error.message);
        return res.status(500).json({ message: "internal server error" });
      }
      break;

    case "PATCH":
      try {
        await updateEventInDb(req.body.id, req.body.values);
        const updatedEvent = await getAllEventsFromDb();
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
        const deletedEvent: any = await deleteEventFromDb(req.body.id);
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
