import { uploadImageToCloudinary } from "@/services/cloudinaryService";

export const uploadImages = async (uploadedImages: any[], location: any, setLocations: any) => {
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
    setLocations(changedLocationData);
  } catch (error) {
    console.error(error);
  }
};

export const deleteImage = async (deleteImageId: string, locationId: string, setLocations?: any) => {
  const response = await fetch(`api/images/${deleteImageId.replace("/", "-")}/?locationId=${locationId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete image.");

  if (setLocations) {
    setLocations((locations: any) => {
      const locationToChange = locations.find((location: any) => location.id === locationId);

      if (locationToChange) {
        const imageIndexToDelete = locationToChange.images.findIndex(
          (image: any) => image.publicId === deleteImageId
        );

        if (imageIndexToDelete >= 0) {
          const newImages = [
            ...locationToChange.images.slice(0, imageIndexToDelete),
            ...locationToChange.images.slice(imageIndexToDelete + 1),
          ];

          const newLocation = { ...locationToChange, images: newImages };
          const newLocations = locations.map((location: any) =>
            location.id === locationId ? newLocation : location
          );

          return newLocations;
        }
      }
      return locations;
    });
  }
};
