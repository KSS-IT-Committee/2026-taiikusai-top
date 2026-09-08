import { eq } from "drizzle-orm";

import { taiikusaiLostItems } from "@/db/schema";
import { db } from "@/lib/db";

export async function deleteLostItem(id: number) {
  await db.delete(taiikusaiLostItems).where(eq(taiikusaiLostItems.id, id));
}
