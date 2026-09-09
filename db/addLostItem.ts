import { taiikusaiLostItems } from "@/db/schema";
import { db } from "@/lib/db";

export async function addLostItem(item: {
  description: string | null;
  fileName: string;
  uploadedBy: string;
}) {
  await db.insert(taiikusaiLostItems).values(item);
}
