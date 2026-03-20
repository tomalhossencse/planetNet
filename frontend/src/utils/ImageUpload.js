import axios from "axios";

export const imgUpload = async (imageData) => {
  // 1.store the img get the photoURl

  const formData = new FormData();
  formData.append("image", imageData);

  // 2. upload the imgBB using Axios

  const img_api_url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`;

  const imgRes = await axios.post(img_api_url, formData);
  const photoURL = imgRes.data.data.url;

  return photoURL;
};

// img upload with cloudinary

// example post endpoint : https://api.cloudinary.com/v1_1/<cloud name>/<resource_type>/upload

export const imgUploadCloudinary = async (imageData) => {
  // 1.store the img get the photoURl

  const formData = new FormData();
  formData.append("file", imageData);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  );

  // 2. upload the img using Axios

  const img_api_url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

  const imgRes = await axios.post(img_api_url, formData);
  const photoURL = imgRes.data.url;

  return photoURL;
};
