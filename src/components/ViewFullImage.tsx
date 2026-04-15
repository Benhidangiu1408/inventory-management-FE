"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface ViewFullImageProps {
  imageUrl: string | null;
  onClose: () => void;
  altText?: string;
}

export default function ViewFullImage({
  imageUrl,
  onClose,
  altText = "Full size image view",
}: ViewFullImageProps) {
  // If there is no image URL, don't render anything!
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose} // Clicking background triggers the close function
    >
      <div className="relative max-h-full max-w-4xl overflow-hidden rounded-lg bg-white p-2 shadow-2xl dark:bg-gray-900">
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-3 right-3 z-40 rounded-full bg-black/50 p-1.5 text-white backdrop-blur transition-colors hover:bg-black/80"
          onClick={(e) => {
            e.stopPropagation(); // Prevent background click from firing twice
            onClose();
          }}
        >
          <X size={20} />
        </button>

        {/* The Full Size Image */}
        <div className="relative h-[85vh] w-[90vw] max-w-4xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 90vw, 1024px"
            onClick={(e) => e.stopPropagation()} // Prevent clicks on the image from closing it
          />
        </div>
      </div>
    </div>
  );
}
