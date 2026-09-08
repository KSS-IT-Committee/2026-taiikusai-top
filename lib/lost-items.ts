/**
 * What the 忘れ物 board accepts. Shared by the upload form and the server
 * action that re-checks every submission.
 */

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * Formats every browser renders. Phones often hand over HEIC, which only
 * Safari can display, so it is rejected at upload with a message rather than
 * published as a picture most people see as a broken box.
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export const MAX_DESCRIPTION_LENGTH = 200;

export function isAllowedImageType(type: string): type is AllowedImageType {
  return ALLOWED_IMAGE_TYPES.includes(type as AllowedImageType);
}

function startsWith(bytes: Uint8Array, signature: readonly number[]): boolean {
  return signature.every((byte, index) => bytes[index] === byte);
}

/**
 * Whether the bytes really are the format the upload claims. The browser's
 * Content-Type comes from the file extension, so a renamed HEIC arrives
 * labelled image/jpeg and would otherwise be published unviewable.
 */
export function looksLikeImageType(
  bytes: Uint8Array,
  type: AllowedImageType,
): boolean {
  switch (type) {
    case "image/jpeg":
      return startsWith(bytes, [0xff, 0xd8, 0xff]);
    case "image/png":
      return startsWith(
        bytes,
        [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
      );
    case "image/webp":
      // "RIFF" ‥ 4 bytes of length ‥ "WEBP"
      return (
        startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
        startsWith(bytes.subarray(8), [0x57, 0x45, 0x42, 0x50])
      );
  }
}
