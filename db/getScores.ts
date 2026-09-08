import { taiikusaiScores } from "@/db/schema";
import { db } from "@/lib/db";
import type { ProgramScore } from "@/lib/score";

export async function getScores(): Promise<ProgramScore[]> {
  return db
    .select({
      program: taiikusaiScores.program,
      blue: taiikusaiScores.blue,
      red: taiikusaiScores.red,
      green: taiikusaiScores.green,
      white: taiikusaiScores.white,
    })
    .from(taiikusaiScores);
}
