import { uploadImageToCloudinary } from "@/services/cloudinaryService";
import { FileWithPath } from "@mantine/dropzone";

export const uploadImages = async (uploadedImages: FileWithPath[], location: Location): Promise<Location> => {
  try {
    const uploadedImageData: any[] = await Promise.all(uploadedImages.map(async (image: any) => uploadImageToCloudinary(image)));

    const response = await fetch(`/api/locations/${location.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        values: { ...location, images: [...location?.images, ...uploadedImageData] },
      }),
    });
    if (!response.ok) throw new Error("Failed to update images in location.");

    const changedLocationData: Location = await response.json();
    return changedLocationData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteImage = async (
  deleteImageId: string,
  locationId: string,
  setLocation?: React.Dispatch<React.SetStateAction<Location>>
) => {
  const response = await fetch(`/api/images/${deleteImageId.replace("/", "-")}/?locationId=${locationId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete image.");

  if (setLocation) {
    setLocation((location: any) => {
      const imageIndexToDelete = location.images.findIndex((image: any) => image.publicId === deleteImageId);

      if (imageIndexToDelete >= 0) {
        const newImages = [...location.images.slice(0, imageIndexToDelete), ...location.images.slice(imageIndexToDelete + 1)];

        const newLocation = { ...location, images: newImages };
        return newLocation;
      }
      return location;
    });
  }
};
