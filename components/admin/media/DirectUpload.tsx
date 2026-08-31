"use client";

import { useState, useRef, useCallback } from "react";
import type { MediaAssetData, SignedUploadParams } from "./types";

interface DirectUploadProps {
  folder: string;
  resourceType: "image" | "video";
  onUploadComplete: (asset: MediaAssetData) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSize?: number;
  label?: string;
}

type UploadState = "idle" | "signing" | "uploading" | "registering" | "success" | "error";

export default function DirectUpload({
  folder,
  resourceType,
  onUploadComplete,
  onUploadError,
  accept,
  maxSize,
  label = "Upload",
}: DirectUploadProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const reset = useCallback(() => {
    setState("idle");
    setProgress(0);
    setError(null);
    fileRef.current = null;
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    fileRef.current = file;
    startUpload(file);
  }, [folder, resourceType]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    fileRef.current = file;
    startUpload(file);
  }, [folder, resourceType]);

  const startUpload = async (file: File) => {
    setError(null);
    setState("signing");

    try {
      const signRes = await fetch("/api/admin/media/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder, resourceType }),
      });

      if (!signRes.ok) {
        const errData = await signRes.json();
        throw new Error(errData.error || "Failed to get upload signature");
      }

      const params: SignedUploadParams = await signRes.json();

      setState("uploading");
      setProgress(0);

      const asset = await uploadToCloudinary(file, params);

      setState("registering");

      const registerRes = await fetch("/api/admin/media/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: asset.public_id,
          secureUrl: asset.secure_url,
          resourceType: asset.resource_type,
          format: asset.format,
          width: asset.width,
          height: asset.height,
        }),
      });

      if (!registerRes.ok) {
        const errData = await registerRes.json();
        throw new Error(errData.error || "Failed to register media");
      }

      const registered: MediaAssetData = await registerRes.json();
      setState("success");
      onUploadComplete(registered);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
      setState("error");
      onUploadError?.(msg);
    }
  };

  const uploadToCloudinary = (file: File, params: SignedUploadParams): Promise<Record<string, unknown>> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", params.apiKey);
      formData.append("timestamp", String(params.timestamp));
      formData.append("signature", params.signature);
      formData.append("folder", params.folder);
      formData.append("resource_type", params.resourceType);

      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error("Cloudinary upload failed"));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
      xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

      xhr.open("POST", `https://api.cloudinary.com/v1_1/${params.cloudName}/${params.resourceType}/upload`);
      xhr.send(formData);
    });
  };

  const handleCancel = useCallback(() => {
    xhrRef.current?.abort();
    reset();
  }, [reset]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div>
      {(state === "idle" || state === "error") && (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#D7C9B8] rounded-lg bg-[#FDF5E6] hover:bg-[#F5E6D0] transition-colors cursor-pointer"
        >
          <span className="text-sm text-[#5D4037]">{label}</span>
          <span className="text-xs text-[#5D4037]/60 mt-1">
            {resourceType === "video" ? "MP4, WebM" : "JPEG, PNG, WebP, GIF"}
          </span>
          <input
            type="file"
            accept={accept || (resourceType === "video" ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp,image/gif")}
            onChange={handleFileSelect}
            className="sr-only"
            aria-label={label}
          />
        </label>
      )}

      {state === "signing" && (
        <div className="flex items-center gap-2 text-sm text-[#5D4037]" role="status" aria-live="polite">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-[#C9A882] border-t-transparent rounded-full" />
          Preparing upload...
        </div>
      )}

      {state === "uploading" && (
        <div className="space-y-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress">
          <div className="flex items-center justify-between text-sm text-[#5D4037]">
            <span>Uploading... {progress}%</span>
            <button type="button" onClick={handleCancel} className="text-red-600 hover:text-red-800 text-xs cursor-pointer">Cancel</button>
          </div>
          <div className="w-full h-2 bg-[#E8DCC8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C9A882] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {state === "registering" && (
        <div className="flex items-center gap-2 text-sm text-[#5D4037]" role="status" aria-live="polite">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-[#C9A882] border-t-transparent rounded-full" />
          Saving media record...
        </div>
      )}

      {state === "success" && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-2" role="status" aria-live="polite">
          Upload complete
        </div>
      )}

      {state === "error" && error && (
        <div className="space-y-2" role="alert">
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </div>
          <button type="button" onClick={reset} className="text-sm text-[#C9A882] hover:underline cursor-pointer">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
