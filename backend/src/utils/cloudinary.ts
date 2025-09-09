import {v2 as cloudinary} from "cloudinary"
import { CLOUD_NAME,API_KEY,API_SECRET } from "../config/env";

cloudinary.config({
    cloud_name:CLOUD_NAME,
    api_key:API_KEY,
    api_secret:API_SECRET
})
interface CloudinaryResult {
  url?: string;
  asset_id?: string;
  public_id?: string;
}

export const cloudinaryUploadImg = async (filePath: string): Promise<CloudinaryResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve( result as CloudinaryResult);
      }
    );
  });
};

// Xoá ảnh
export const cloudinaryDeleteImg = async (publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  // Các trường khác có thể có từ Cloudinary (như url gốc, size, format, ...)
  [key: string]: any;
}

// Hàm upload ảnh lên Cloudinary
export const uploadImageToCloudinary = async (
  file: Express.Multer.File
): Promise<CloudinaryUploadResult> => {
  try {
    // Kiểm tra nếu file có tồn tại và là một file hợp lệ
    if (!file || !file.buffer) {
      throw new Error('No file buffer found');
    }
    

    // Upload ảnh lên Cloudinary thông qua upload_stream
    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: 'auto' }, // Tự động nhận dạng tài nguyên (ảnh, video, v.v.)
            (error, result) => {
              if (error) {
                return reject(error); // Nếu có lỗi, từ chối promise
              }
              resolve(result as CloudinaryUploadResult); // Trả về kết quả sau khi upload thành công
            }
          )
          .end(file.buffer); // Kết thúc và upload file buffer
      }
    );

    return result; // Trả về kết quả upload từ Cloudinary
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Error uploading image to Cloudinary');
  }
};
