"use server";

import { revalidatePath } from "next/cache";

import { setScores } from "@/db/setScores";
import { hasAnyRole } from "@/lib/access";
import { MAX_SCORE, PROGRAMS, type ProgramScore, TEAMS } from "@/lib/score";
import { SCORE_ADMIN_ROLES } from "@/lib/score-access";
import { getCurrentUser } from "@/lib/session";

export type ScoreFormState = {
  error: string | null;
  isSaved: boolean;
};

function normalizeInput(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.normalize("NFKC").trim() : "";
}

function parseScore(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed <= MAX_SCORE ? parsed : null;
}

export async function submitScoresAction(
  _previousState: ScoreFormState,
  formData: FormData,
): Promise<ScoreFormState> {
  const operator = await getCurrentUser();
  if (operator === null || !hasAnyRole(operator, SCORE_ADMIN_ROLES)) {
    return { error: "得点を編集する権限がありません。", isSaved: false };
  }

  const rows: ProgramScore[] = [];
  for (const program of PROGRAMS) {
    const row: ProgramScore = {
      program: program.number,
      blue: null,
      red: null,
      green: null,
      white: null,
    };
    for (const team of TEAMS) {
      const raw = normalizeInput(formData.get(`${program.number}-${team.id}`));
      // An empty cell means "まだ実施していない", not zero — leave it NULL.
      if (raw === "") continue;
      const score = parseScore(raw);
      if (score === null) {
        return {
          error: `${program.name}（${program.entrants}）${team.name}の得点は0から${MAX_SCORE}までの整数で入力してください。`,
          isSaved: false,
        };
      }
      row[team.id] = score;
    }
    rows.push(row);
  }

  try {
    await setScores(rows);
  } catch {
    return { error: "得点の保存に失敗しました。", isSaved: false };
  }

  revalidatePath("/");
  revalidatePath("/score/edit");
  return { error: null, isSaved: true };
}
