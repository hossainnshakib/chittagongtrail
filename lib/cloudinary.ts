import { v2 as cloudinary } from "cloudinary";

const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function getCloudinaryClient() {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured");
  }

  return cloudinary;
}

export const ALLOWED_UPLOAD_FOLDERS = [
  "chittagong-trail/trails",
  "chittagong-trail/journal",
  "chittagong-trail/food",
  "chittagong-trail/homepage",
  "chittagong-trail/general",
  "chittagong-trail/video",
] as const;

export type UploadFolder = (typeof ALLOWED_UPLOAD_FOLDERS)[number];

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
] as const;

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export const CLOUDINARY_CLOUD_NAME = cloudName;
