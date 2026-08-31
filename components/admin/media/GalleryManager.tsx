"use client";

import { useState } from "react";
import Image from "next/image";
import MediaPicker from "./MediaPicker";
import DirectUpload from "./DirectUpload";
import type { MediaAssetData } from "./types";

interface GalleryManagerProps {
  assets: MediaAssetData[];
  onChange: (assets: MediaAssetData[]) => void;
  folder: string;
}

export default function GalleryManager({ assets, onChange, folder }: GalleryManagerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...assets];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const handleMoveDown = (index: number) => {
    if (index >= assets.length - 1) return;
    const next = [...assets];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  const handleRemove = (index: number) => {
    onChange(assets.filter((_, i) => i !== index));
  };

  const handleSelect = (asset: MediaAssetData) => {
    if (!assets.some((a) => a.id === asset.id)) {
      onChange([...assets, asset]);
    }
  };

  const handleUploadComplete = (asset: MediaAssetData) => {
    setShowUpload(false);
    if (!assets.some((a) => a.id === asset.id)) {
      onChange([...assets, asset]);
    }
  };

  return (
    <div className="space-y-3">
      {assets.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {assets.map((asset, index) => (
            <div key={asset.id} className="relative group rounded-lg overflow-hidden border border-[#D7C9B8]">
              <div className="aspect-square relative">
                <Image src={asset.secureUrl} alt={asset.altText || ""} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" />
              </div>
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="w-6 h-6 bg-black/60 text-white rounded text-xs disabled:opacity-30 cursor-pointer"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === assets.length - 1}
                  className="w-6 h-6 bg-black/60 text-white rounded text-xs disabled:opacity-30 cursor-pointer"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="w-6 h-6 bg-red-600 text-white rounded text-xs cursor-pointer"
                  aria-label="Remove from gallery"
                >
                  ×
                </button>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-1">
                <p className="text-[10px] text-white truncate">{index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="px-3 py-2 text-sm bg-[#E8DCC8] hover:bg-[#D7C9B8] text-[#5D4037] rounded-md transition-colors cursor-pointer"
        >
          Select from Library
        </button>
        <button
          type="button"
          onClick={() => setShowUpload(!showUpload)}
          className="px-3 py-2 text-sm bg-[#E8DCC8] hover:bg-[#D7C9B8] text-[#5D4037] rounded-md transition-colors cursor-pointer"
        >
          {showUpload ? "Cancel Upload" : "Upload New"}
        </button>
      </div>

      {showUpload && (
        <DirectUpload
          folder={folder}
          resourceType="image"
          onUploadComplete={handleUploadComplete}
          label="Drop gallery image here"
        />
      )}

      <MediaPicker
        open={pickerOpen}
        mode="image"
        folder={folder}
        selected={null}
        onSelect={handleSelect}
        onClose={() => setPickerOpen(false)}
        title="Select Gallery Images"
        description="Choose images for this trail gallery"
      />

      {assets.length > 0 && (
        <p className="text-xs text-[#5D4037]/60">
          {assets.length} image{assets.length !== 1 ? "s" : ""} in gallery. Drag to reorder using the arrow buttons.
        </p>
      )}
    </div>
  );
}
