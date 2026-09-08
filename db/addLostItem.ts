import { taiikusaiLostItems } from "@/db/schema";
import { db } from "@/lib/db";
import type { AllowedImageType } from "@/lib/lost-items";

export async function addLostItem(item: {
  description: string | null;
  contentType: AllowedImageType;
  imageBytes: Buffer;
  uploadedBy: string;
}) {
  await db.insert(taiikusaiLostItems).values(item);
}
