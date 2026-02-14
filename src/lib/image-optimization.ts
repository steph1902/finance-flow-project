/**
 * Image Optimization Configuration
 *
 * Centralized image optimization settings and helpers
 */

import type { ImageLoaderProps } from "next/image";

/**
 * Custom image loader for optimization
 */
export function customImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  // If using a CDN, configure it here
  // Example: return `https://cdn.example.com/${src}?w=${width}&q=${quality || 75}`

  return `${src}?w=${width}&q=${quality || 75}`;
}

/**
 * Supported image formats
 */
export const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
] as const;

/**
 * Maximum file sizes (in bytes)
 */
export const MAX_IMAGE_SIZE = {
  AVATAR: 2 * 1024 * 1024, // 2MB
  ATTACHMENT: 5 * 1024 * 1024, // 5MB
  RECEIPT: 10 * 1024 * 1024, // 10MB
} as const;

/**
 * Image dimensions
 */
export const IMAGE_DIMENSIONS = {
  AVATAR: { width: 200, height: 200 },
  THUMBNAIL: { width: 150, height: 150 },
  PREVIEW: { width: 600, height: 400 },
  FULL: { width: 1200, height: 800 },
} as const;

/**
 * Validate image file
 */
export function validateImage(
  file: File,
  maxSize: number = MAX_IMAGE_SIZE.ATTACHMENT,
): { valid: boolean; error?: string } {
  if (
    !SUPPORTED_IMAGE_FORMATS.includes(
      file.type as (typeof SUPPORTED_IMAGE_FORMATS)[number],
    )
  ) {
    return {
      valid: false,
      error:
        "Unsupported image format. Please use JPEG, PNG, WebP, AVIF, or GIF.",
    };
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Image size must be less than ${maxSizeMB}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Convert image to WebP format (client-side)
 */
export async function convertToWebP(
  file: File,
  quality: number = 0.8,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to convert image"));
            }
          },
          "image/webp",
          quality,
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Compress image while maintaining aspect ratio
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          file.type,
          quality,
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
