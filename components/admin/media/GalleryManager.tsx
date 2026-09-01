"use client";

import { useState } from "react";
import Image from "next/image";
import MediaPicker from "./MediaPicker";
import type { MediaAssetData } from "./types";

interface GalleryManagerProps {
  assets: MediaAssetData[];
  onChange: (assets: MediaAssetData[]) => void;
  folder: string;
}

export default function GalleryManager({ assets, onChange, folder }: GalleryManagerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

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

  return (
    <div className="space-y-2">
      {assets.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {assets.map((asset, index) => (
            <div key={asset.id} className="relative group rounded overflow-hidden border border-[#D7C9B8]">
              <div className="aspect-square relative">
                <Image src={asset.secureUrl} alt={asset.altText || ""} fill className="object-cover" sizes="(max-width: 640px) 33vw, 25vw" />
              </div>
              <div className="absolute top-0.5 right-0.5 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="w-5 h-5 bg-black/60 text-white rounded text-[10px] disabled:opacity-30 cursor-pointer flex items-center justify-center"
                  aria-label="Move left"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === assets.length - 1}
                  className="w-5 h-5 bg-black/60 text-white rounded text-[10px] disabled:opacity-30 cursor-pointer flex items-center justify-center"
                  aria-label="Move right"
                >
                  &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="w-5 h-5 bg-red-600 text-white rounded text-[10px] cursor-pointer flex items-center justify-center"
                  aria-label="Remove from gallery"
                >
                  &times;
                </button>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-0.5">
                <p className="text-[9px] text-white text-center">{index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="w-full px-3 py-1.5 text-xs bg-[#E8DCC8] hover:bg-[#D7C9B8] text-[#5D4037] rounded transition-colors cursor-pointer"
      >
        Add images ({assets.length})
      </button>

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
    </div>
  );
}
