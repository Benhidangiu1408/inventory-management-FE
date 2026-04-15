"use client";

import { useState } from "react";
import Image from "next/image";

interface ImagePickerProps {
  existingImageUrl?: string | null;
  onFileSelected: (file: File | null) => void;
}

export default function ImagePicker({
  existingImageUrl,
  onFileSelected,
}: ImagePickerProps) {
  const [preview, setPreview] = useState<string | null>(
    existingImageUrl || null,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // Show local preview instantly
      onFileSelected(file); // Hand the raw file up to the parent form!
    } else {
      setPreview(existingImageUrl || null);
      onFileSelected(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-gray-300 p-6">
      {preview ? (
        <Image
          src={preview}
          alt="Preview"
          width={128}
          height={128}
          className="rounded-lg object-cover shadow-sm"
        />
      ) : (
        <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
          No Image
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full max-w-xs text-sm file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  );
}
