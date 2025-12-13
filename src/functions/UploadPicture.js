export const UploadPicture = async (base64Image) => {
  const cloudName = "dablcbuqb";
  const uploadPreset = "courts";

  const formData = new FormData();
  formData.append("file", base64Image);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    import.meta.env.VITE_CLOUDINARY_UPLOAD_URL,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};
