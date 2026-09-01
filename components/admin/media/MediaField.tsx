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
      <label className="block text-xs font-medium text-[#5D4037] mb-1">{label}</label>
      {value ? (
        <div className="space-y-1.5">
          <div className="relative w-full aspect-video rounded-md overflow-hidden border border-[#D7C9B8] bg-[#FDF5E6]">
            {value.resourceType === "video" ? (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            ) : (
              <Image src={value.secureUrl} alt={value.altText || label} fill className="object-cover" sizes="200px" />
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#5D4037]/50 truncate">
            <span className="truncate">{value.publicId.split("/").pop()}</span>
            {value.width && value.height && <span className="flex-shrink-0">{value.width}×{value.height}</span>}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex-1 px-2 py-1 text-xs bg-[#E8DCC8] hover:bg-[#D7C9B8] text-[#5D4037] rounded transition-colors cursor-pointer"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="px-2 py-1 text-xs text-red-600 hover:text-red-800 cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          {showUseCoverOption && coverValue && (
            <button
              type="button"
              onClick={onUseCover}
              className="w-full flex items-center gap-2 p-1.5 border border-[#D7C9B8] rounded bg-[#FDF5E6] hover:bg-[#F5E6D0] transition-colors text-left cursor-pointer"
            >
              <div className="relative w-8 h-8 rounded overflow-hidden border border-[#D7C9B8] flex-shrink-0">
                <Image src={coverValue.secureUrl} alt="" fill className="object-cover" sizes="32px" />
              </div>
              <span className="text-[11px] text-[#5D4037] leading-tight">Use cover image</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-full h-16 border border-dashed border-[#D7C9B8] rounded bg-[#FDF5E6] hover:bg-[#F5E6D0] transition-colors flex flex-col items-center justify-center cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#5D4037]/40 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m6-6H6" />
            </svg>
            <span className="text-[11px] text-[#5D4037]">Select image</span>
          </button>
          {recommendedDimensions && (
            <p className="text-[10px] text-[#5D4037]/50">{recommendedDimensions}</p>
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
