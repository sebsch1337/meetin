import { uploadImageToCloudinary } from "@/services/cloudinaryService";

export const uploadImages = async (uploadedImages: any[], location: any, setLocation: any) => {
  try {
    const uploadedImageData: any[] = await Promise.all(
      uploadedImages.map(async (image: any) => uploadImageToCloudinary(image))
    );

    const response = await fetch(`/api/locations/${location.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        values: { ...location, images: [...location?.images, ...uploadedImageData] },
      }),
    });
    if (!response.ok) throw new Error("Failed to update images in location.");

    const changedLocationData: any = await response.json();
    setLocation(changedLocationData.find((locationData: Location) => locationData.id === location.id));
  } catch (error) {
    console.error(error);
  }
};

export const deleteImage = async (deleteImageId: string, locationId: string, setLocation?: any) => {
  const response = await fetch(`/api/images/${deleteImageId.replace("/", "-")}/?locationId=${locationId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete image.");

  if (setLocation) {
    setLocation((location: any) => {
      const imageIndexToDelete = location.images.findIndex((image: any) => image.publicId === deleteImageId);

      if (imageIndexToDelete >= 0) {
        const newImages = [
          ...location.images.slice(0, imageIndexToDelete),
          ...location.images.slice(imageIndexToDelete + 1),
        ];

        const newLocation = { ...location, images: newImages };
        return newLocation;
      }
      return location;
    });
  }
};
