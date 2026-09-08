import { eq } from "drizzle-orm";

import { taiikusaiLostItems } from "@/db/schema";
import { db } from "@/lib/db";

export type LostItemImage = {
  contentType: string;
  imageBytes: Buffer;
};

export async function getLostItemImage(
  id: number,
): Promise<LostItemImage | null> {
  const [row] = await db
    .select({
      contentType: taiikusaiLostItems.contentType,
      imageBytes: taiikusaiLostItems.imageBytes,
    })
    .from(taiikusaiLostItems)
    .where(eq(taiikusaiLostItems.id, id));
  return row ?? null;
}
