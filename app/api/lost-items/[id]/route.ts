import { getLostItemImage } from "@/db/getLostItemImage";

/**
 * Serves one 忘れ物 photo from its row. A row's bytes are never rewritten —
 * an edit means a new row with a new id — so the response can be cached hard.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const image = await getLostItemImage(Number(id));
  if (image === null) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(image.imageBytes), {
    headers: {
      "Content-Type": image.contentType,
      "Content-Length": String(image.imageBytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      // The stored type is always one of the allowed image types, but say so
      // out loud rather than letting a browser sniff the bytes for itself.
      "X-Content-Type-Options": "nosniff",
    },
  });
}
