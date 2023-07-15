import { deleteImageFromCloudinary } from "@/services/cloudinaryService";
import { deleteImageByIdFromDb } from "@/services/locationService";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: any, res: any): Promise<any> {
  const {
    query: { publicId, locationId },
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "unauthorized" });

  switch (method) {
    case "DELETE":
      try {
        const sanitizedPublicId = publicId.replace("-", "/");
        const [, changedLocation]: [any, Location] = await Promise.all([
          deleteImageFromCloudinary(sanitizedPublicId),
          deleteImageByIdFromDb(sanitizedPublicId, locationId),
        ]);
        res.status(200).json(changedLocation);
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
