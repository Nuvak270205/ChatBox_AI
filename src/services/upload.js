import axios from "axios";

// Cấu hình Cloudinary, có thể ghi đè bằng biến môi trường trong file .env.
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dpnza0kof";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "chatbox_ai";

// Tạo URL upload Cloudinary theo loại tài nguyên.
function getCloudinaryUrl(resourceType = "image") {
  const normalizedType = resourceType === "raw" ? "raw" : "image";

  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${normalizedType}/upload`;
}

/**
 * Upload file lên Cloudinary.
 * @param {File} file - File cần upload.
 * @param {string} resourceType - 'image', 'video', 'raw' hoặc 'auto'.
 * @returns {Promise<string>} - URL của file sau khi upload.
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
    throw new Error("Upload thành công nhưng không nhận được URL trả về");
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401) {
      throw new Error("Cloudinary trả về 401. Kiểm tra upload preset phải là unsigned và đúng tên preset/cloud name trong .env");
    }

    if (status === 400) {
      const cloudinaryMessage = error?.response?.data?.error?.message;
      throw new Error(cloudinaryMessage || "Cloudinary trả về 400. Kiểm tra preset, loại file, hoặc endpoint upload");
    }

    console.error("Upload file lên Cloudinary thất bại:", error);
    throw error;
  }
};

/**
 * Upload file ảnh.
 * @param {File} file - File ảnh cần upload.
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = (file) => {
  if (!file.type.startsWith("image/")) {
    throw new Error("File phải là ảnh");
  }
  return uploadToCloudinary(file, "image");
};

/**
 * Upload file tài liệu.
 * @param {File} file - File tài liệu cần upload (PDF, DOC, XLS, ...).
 * @returns {Promise<{url: string, publicId: string, size: number}>}
 */
export const uploadFile = (file) => {
  const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain"];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Định dạng file chưa được hỗ trợ");
  }
  
  return uploadToCloudinary(file, "raw");
};
