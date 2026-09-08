import { sql } from "drizzle-orm";

import { taiikusaiScores } from "@/db/schema";
import { db } from "@/lib/db";
import type { ProgramScore } from "@/lib/score";

/**
 * Replaces the whole 得点表 in one statement, so a save can never leave the
 * board half-updated. Programs the caller leaves out keep their current row.
 */
export async function setScores(scores: ProgramScore[]) {
  if (scores.length === 0) return;
  await db
    .insert(taiikusaiScores)
    .values(scores)
    .onConflictDoUpdate({
      target: taiikusaiScores.program,
      set: {
        blue: sql`excluded.blue`,
        red: sql`excluded.red`,
        green: sql`excluded.green`,
        white: sql`excluded.white`,
        updatedAt: sql`now()`,
      },
    });
}
