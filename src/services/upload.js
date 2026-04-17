import axios from "axios";

// Cloudinary configuration - configure these in your .env file
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dpnza0kof";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "chatbox_ai";

function getCloudinaryUrl(resourceType = "image") {
  const normalizedType = resourceType === "raw" ? "raw" : "image";

  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${normalizedType}/upload`;
}

/**
 * Upload file to Cloudinary
 * @param {File} file - File to upload
 * @param {string} resourceType - 'image', 'video', 'raw', or 'auto'
 * @returns {Promise<string>} - URL of uploaded file
 */
export const uploadToCloudinary = async (file, resourceType = "auto") => {
  try {
    if (!CLOUDINARY_CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Thiếu cấu hình Cloudinary. Kiểm tra VITE_CLOUDINARY_CLOUD_NAME và VITE_CLOUDINARY_UPLOAD_PRESET trong .env");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await axios.post(getCloudinaryUrl(resourceType), formData);

    if (response.data?.secure_url) {
      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
        resourceType: response.data.resource_type,
        size: response.data.bytes,
        type: response.data.type,
      };
    }
    throw new Error("No URL returned from upload");
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401) {
      throw new Error("Cloudinary trả về 401. Kiểm tra upload preset phải là unsigned và đúng tên preset/cloud name trong .env");
    }

    if (status === 400) {
      const cloudinaryMessage = error?.response?.data?.error?.message;
      throw new Error(cloudinaryMessage || "Cloudinary trả về 400. Kiểm tra preset, loại file, hoặc endpoint upload");
    }

    console.error("Upload to Cloudinary failed:", error);
    throw error;
  }
};

/**
 * Upload image file
 * @param {File} file - Image file to upload
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = (file) => {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }
  return uploadToCloudinary(file, "image");
};

/**
 * Upload document file
 * @param {File} file - Document file to upload (PDF, DOC, XLS, etc.)
 * @returns {Promise<{url: string, publicId: string, size: number}>}
 */
export const uploadFile = (file) => {
  const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain"];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error("File type not supported");
  }
  
  return uploadToCloudinary(file, "raw");
};
