import { sql } from "drizzle-orm";

import { taiikusaiProgress } from "@/db/schema";
import { db } from "@/lib/db";

// The table holds one row and the schema's CHECK pins it to this id.
const PROGRESS_ROW_ID = 1;

/**
 * Moves the marker onto `programId` (null for "not started yet"). `updated_at`
 * is bumped every time, including when the same program is submitted again —
 * that timestamp is what the 押し/巻き figure is measured from.
 */
export async function setProgress(programId: string | null) {
  await db
    .insert(taiikusaiProgress)
    .values({ id: PROGRESS_ROW_ID, programId })
    .onConflictDoUpdate({
      target: taiikusaiProgress.id,
      set: { programId, updatedAt: sql`now()` },
    });
}
