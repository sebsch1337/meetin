import crypto from "crypto";

const cloudName = "djhelp2md";
const apiKey = "129367815296377";
const apiSecret = process.env.CLOUDINARY_SECRET;
const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}`;

const cloudinarySignature = (timestamp: string, publicId: string) =>
  crypto.createHash("sha1").update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`).digest("hex");

export const uploadImagesToCloudinary = async (images: any): Promise<string[]> =>
  await Promise.all(
    images.map(async (image: any) => {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "meetin");
      try {
        const response = await fetch(cloudinaryUrl + "/image/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        return data.secure_url;
      } catch (e) {
        return "Error: " + e;
      }
    })
  );

export const deleteImageFromCloudinary = async (publicId: string) => {
  const publicImageId = `images/${publicId}`;
  const deleteUrl = cloudinaryUrl + "/image/destroy";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = cloudinarySignature(timestamp, publicImageId);
  const formData = new FormData();
  formData.append("timestamp", timestamp);
  formData.append("public_id", publicImageId);
  formData.append("api_key", apiKey);
  formData.append("signature", signature);
  const response = await fetch(deleteUrl, {
    method: "DELETE",
    body: formData,
  });
  if (!response.ok) {
    const error: any = new Error("error deleting image: " + signature);
    error.status = response.status;
    throw error;
  }
};
