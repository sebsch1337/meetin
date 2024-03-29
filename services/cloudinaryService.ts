import crypto from "crypto";

const cloudName = "djhelp2md";
const apiKey = "129367815296377";
const apiSecret = process.env.CLOUDINARY_SECRET;
const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}`;

export const createCloudinarySignature = (publicId: string, timestamp: string, uploadPreset: string): string => {
  const secret = `${publicId ? `public_id=${publicId}&` : ""}${timestamp ? `timestamp=${timestamp}` : ""}${
    uploadPreset ? `&upload_preset=${uploadPreset}` : ""
  }${apiSecret}`;

  return crypto.createHash("sha1").update(secret).digest("hex");
};

export const getCloudinarySignature = async (publicId: any, timestamp: any, uploadPreset: any): Promise<string> => {
  const res = await fetch(
    "/api/images/?" +
      `${publicId ? `public_id=${publicId}&` : ""}${timestamp ? `timestamp=${timestamp}` : ""}${
        uploadPreset ? `&uploadPreset=${uploadPreset}` : ""
      }`
  );

  const response = await res.json();
  return response;
};

export const uploadImageToCloudinary = async (image: any): Promise<any> => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const uploadPreset = "meetin";
  const signature = await getCloudinarySignature(null, timestamp, uploadPreset);

  const formData = new FormData();
  formData.append("api_key", apiKey);
  formData.append("file", image);
  formData.append("timestamp", timestamp);
  formData.append("upload_preset", uploadPreset);
  formData.append("signature", signature);

  try {
    const response = await fetch(cloudinaryUrl + "/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return { publicId: data.public_id, url: data.secure_url };
  } catch (error) {
    return error;
  }
};

export const deleteImageFromCloudinary = async (publicId: string): Promise<any> => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createCloudinarySignature(publicId, timestamp, "");

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("timestamp", timestamp);
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  try {
    const response = await fetch(cloudinaryUrl + "/image/destroy", {
      method: "DELETE",
      body: formData,
    });

    if (!response.ok) {
      const error: any = new Error("error deleting image: " + response);
      error.status = response.status;
      throw error;
    }
  } catch (error) {
    return 500;
  }
};
