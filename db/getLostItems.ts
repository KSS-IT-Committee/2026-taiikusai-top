import { desc } from "drizzle-orm";

import { taiikusaiLostItems } from "@/db/schema";
import { db } from "@/lib/db";

export type LostItem = {
  id: number;
  description: string | null;
  fileName: string;
  uploadedBy: string;
  createdAt: Date;
};

/** Newest first. */
export async function getLostItems(): Promise<LostItem[]> {
  return db
    .select({
      id: taiikusaiLostItems.id,
      description: taiikusaiLostItems.description,
      fileName: taiikusaiLostItems.fileName,
      uploadedBy: taiikusaiLostItems.uploadedBy,
      createdAt: taiikusaiLostItems.createdAt,
    })
    .from(taiikusaiLostItems)
    .orderBy(desc(taiikusaiLostItems.createdAt));
}
