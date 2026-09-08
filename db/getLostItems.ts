import { desc } from "drizzle-orm";

import { taiikusaiLostItems } from "@/db/schema";
import { db } from "@/lib/db";

export type LostItem = {
  id: number;
  description: string | null;
  uploadedBy: string;
  createdAt: Date;
};

/** Newest first, without the image bytes — those are served by their own route. */
export async function getLostItems(): Promise<LostItem[]> {
  return db
    .select({
      id: taiikusaiLostItems.id,
      description: taiikusaiLostItems.description,
      uploadedBy: taiikusaiLostItems.uploadedBy,
      createdAt: taiikusaiLostItems.createdAt,
    })
    .from(taiikusaiLostItems)
    .orderBy(desc(taiikusaiLostItems.createdAt));
}
