"use client";

import { useState } from "react";
import Image from "next/image";
import MediaPicker from "./MediaPicker";
import type { MediaAssetData, MediaPickerMode } from "./types";

interface MediaFieldProps {
  label: string;
  value: MediaAssetData | null;
  onChange: (asset: MediaAssetData | null) => void;
  mode?: MediaPickerMode;
  folder?: string;
  recommendedDimensions?: string;
  showUseCoverOption?: boolean;
  coverValue?: MediaAssetData | null;
  onUseCover?: () => void;
}

export default function MediaField({
  label,
  value,
  onChange,
  mode = "image",
  folder = "chittagong-trail/general",
  recommendedDimensions,
  showUseCoverOption = false,
  coverValue,
  onUseCover,
}: MediaFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-[#5D4037] mb-1">{label}</label>
      {value ? (
        <div className="space-y-2">
          <div className="relative w-32 h-20 rounded-md overflow-hidden border border-[#D7C9B8]">
            {value.resourceType === "video" ? (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                <svg className="w-6 h-6 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            ) : (
              <Image src={value.secureUrl} alt={value.altText || label} fill className="object-cover" sizes="128px" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#5D4037]/60">
            <span>{value.publicId.split("/").pop()}</span>
            {value.width && value.height && <span>({value.width}×{value.height})</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="px-3 py-1.5 text-sm bg-[#E8DCC8] hover:bg-[#D7C9B8] text-[#5D4037] rounded-md transition-colors cursor-pointer"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {showUseCoverOption && coverValue && (
            <button
              type="button"
              onClick={onUseCover}
              className="w-full flex items-center gap-3 p-2 border border-[#D7C9B8] rounded-md bg-[#FDF5E6] hover:bg-[#F5E6D0] transition-colors text-left cursor-pointer"
            >
              <div className="relative w-10 h-10 rounded overflow-hidden border border-[#D7C9B8] flex-shrink-0">
                <Image src={coverValue.secureUrl} alt="" fill className="object-cover" sizes="40px" />
              </div>
              <span className="text-sm text-[#5D4037]">Use cover image for social sharing</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-full h-20 border-2 border-dashed border-[#D7C9B8] rounded-lg bg-[#FDF5E6] hover:bg-[#F5E6D0] transition-colors flex flex-col items-center justify-center cursor-pointer"
          >
            <svg className="w-6 h-6 text-[#5D4037]/40 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m6-6H6" />
            </svg>
            <span className="text-sm text-[#5D4037]">Select media</span>
          </button>
          {recommendedDimensions && (
            <p className="text-xs text-[#5D4037]/60">Recommended: {recommendedDimensions}</p>
          )}
        </div>
      )}

      <MediaPicker
        open={pickerOpen}
        mode={mode}
        folder={folder}
        selected={value}
        onSelect={(asset) => { onChange(asset); setPickerOpen(false); }}
        onClose={() => setPickerOpen(false)}
        title={`Select ${label}`}
      />
    </div>
  );
}
