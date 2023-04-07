import { createCloudinarySignature, uploadImageToCloudinary } from "@/services/cloudinaryService";

export default async function handler(req: any, res: any): Promise<any> {
  const {
    query: { publicId, timestamp, uploadPreset },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const signature = createCloudinarySignature(publicId || null, timestamp, uploadPreset || null);
        res.status(200).json(signature);
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
