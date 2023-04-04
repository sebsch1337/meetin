import { uploadImageToCloudinary } from "@/services/cloudinary";

export const uploadImages = async (images: any[], locationId: string, setLocations: any) => {
  try {
    const uploadedImageData: any[] = await Promise.all(
      images.map(async (image: any) => uploadImageToCloudinary(image))
    );

    setLocations((prevLocations: any) => {
      const locationToChange: any = prevLocations?.find((location: any) => location.id === locationId);
      locationToChange.images = [...locationToChange?.images, ...uploadedImageData];
      return prevLocations;
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteImage = async (
  deleteImageId: string,
  locationId: string,
  setLocations?: any
): Promise<Response> => {
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
      console.log(deleteImageId, " geloescht.");
      return locations;
    });
  }

  return await fetch("api/images/?publicId=" + deleteImageId, { method: "DELETE" });
};
