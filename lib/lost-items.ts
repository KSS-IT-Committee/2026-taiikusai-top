/**
 * The client-safe half of the 忘れ物 board's rules. The format allowlist and
 * everything that touches the filesystem live in lib/lost-item-images.ts,
 * which is server-only.
 */

// Public URL prefix for a stored photo, served by the
// app/lost-item-images/[name] route handler. Uploads do NOT live under public/:
// they go on the persistent /app/files mount, which is outside the build
// output, so Next cannot auto-serve them. It lives here rather than beside the
// rest of the image code because the edit page's client components build these
// URLs too, and that module is server-only.
export const IMAGE_URL_PREFIX = "/lost-item-images/";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const MAX_DESCRIPTION_LENGTH = 200;

/** `accept` for the file input. Advisory only — the bytes decide. */
export const IMAGE_ACCEPT =
  "image/png,image/jpeg,image/gif,image/webp,image/avif";

export const ALLOWED_IMAGE_LABEL = "PNG・JPEG・GIF・WebP・AVIF";
