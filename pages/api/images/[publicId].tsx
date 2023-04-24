import { deleteImageFromCloudinary } from "@/services/cloudinaryService";
import { deleteImageByIdFromDb } from "@/services/locationService";

export default async function handler(req: any, res: any): Promise<any> {
  const {
    query: { publicId, locationId },
    method,
  } = req;

  switch (method) {
    case "DELETE":
      try {
        const sanitizedPublicId = publicId.replace("-", "/");
        const deletedImage: any = await deleteImageFromCloudinary(sanitizedPublicId);
        await deleteImageByIdFromDb(sanitizedPublicId, locationId);
        res.status(200).json(deletedImage);
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
