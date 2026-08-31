export interface MediaAssetData {
  id: number;
  publicId: string;
  secureUrl: string;
  resourceType: string;
  format: string | null;
  width: number | null;
  height: number | null;
  altText: string | null;
}

export interface SignedUploadParams {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  resourceType: string;
}

export type MediaPickerMode = "image" | "video" | "any";

export interface MediaPickerProps {
  open: boolean;
  mode: MediaPickerMode;
  folder?: string;
  selected: MediaAssetData | null;
  onSelect: (asset: MediaAssetData) => void;
  onRemove?: () => void;
  onClose: () => void;
  title?: string;
  description?: string;
}
