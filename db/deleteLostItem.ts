import { eq } from "drizzle-orm";

import { taiikusaiLostItems } from "@/db/schema";
import { db } from "@/lib/db";

/**
 * Removes the row and reports the file it pointed at, plus how many rows still
 * reference that file. The caller unlinks only when nothing does — names are
 * content-addressed, so two postings of the same photo share one file.
 */
export async function deleteLostItem(
  id: number,
): Promise<{ fileName: string; remainingRefs: number } | null> {
  return db.transaction(async (tx) => {
    const [deleted] = await tx
      .delete(taiikusaiLostItems)
      .where(eq(taiikusaiLostItems.id, id))
      .returning({ fileName: taiikusaiLostItems.fileName });
    if (!deleted) return null;

    const remaining = await tx
      .select({ id: taiikusaiLostItems.id })
      .from(taiikusaiLostItems)
      .where(eq(taiikusaiLostItems.fileName, deleted.fileName));

    return { fileName: deleted.fileName, remainingRefs: remaining.length };
  });
}
