export const imgFun = async (
  preview: string | null,
) => {
  if (preview) {
    try {
      const response = await fetch(preview); // Fetch the blob data
      const blob = await response.blob(); // Convert response to Blob

      // Create a File object from the Blob
      const file = new File([blob], "profilePicture.webp", { type: blob.type });

      const formData = new FormData();
      formData.append("profilePicture", file);

      console.log("This is form Data", formData);

      // Upload to backend
      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_IMAGE_URL}upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadData?.url) {
        console.error("Failed to get uploaded image URL.");
        return;
      }

      console.log("Uploaded Image URL:", uploadData.url);
      return uploadData.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return;
    }
  }
};
