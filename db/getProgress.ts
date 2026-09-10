import { taiikusaiProgress } from "@/db/schema";
import { db } from "@/lib/db";

export type ProgressRow = {
  programId: string | null;
  updatedAt: Date;
};

/** The progress marker, or null while the committee has never set one. */
export async function getProgress(): Promise<ProgressRow | null> {
  const [row] = await db
    .select({
      programId: taiikusaiProgress.programId,
      updatedAt: taiikusaiProgress.updatedAt,
    })
    .from(taiikusaiProgress)
    .limit(1);
  return row ?? null;
}
