export const uploadImages = async (images: any): Promise<string[]> =>
  await Promise.all(
    images.map(async (image: any) => {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "meetin");
      try {
        const response = await fetch("https://api.cloudinary.com/v1_1/djhelp2md/image/upload", {
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
