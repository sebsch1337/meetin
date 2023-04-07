import { uploadImageToCloudinary } from "@/services/cloudinaryService";

export const uploadImages = async (
  uploadedImages: any[],
  prevImages: any[],
  locationId: string,
  setLocations: any
) => {
  try {
    const uploadedImageData: any[] = await Promise.all(
      uploadedImages.map(async (image: any) => uploadImageToCloudinary(image))
    );

    const response = await fetch("/api/locations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: locationId, values: { images: [...prevImages, ...uploadedImageData] } }),
    });
    if (!response.ok) throw new Error("Failed to update images in location.");

    setLocations((prevLocations: any) => {
      const locationToChange: any = prevLocations?.find((location: any) => location.id === locationId);
      locationToChange.images = [...locationToChange?.images, ...uploadedImageData];
      return prevLocations;
    });
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
