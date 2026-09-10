"use server";

import { revalidatePath } from "next/cache";

import { setProgress } from "@/db/setProgress";
import { hasAnyRole } from "@/lib/access";
import { getCurrentUser } from "@/lib/session";
import { FINISHED, programItem } from "@/lib/timetable";
import { TIMETABLE_ADMIN_ROLES } from "@/lib/timetable-access";

export type ProgressFormState = {
  error: string | null;
  isSaved: boolean;
};

export async function submitProgressAction(
  _previousState: ProgressFormState,
  formData: FormData,
): Promise<ProgressFormState> {
  const operator = await getCurrentUser();
  if (operator === null || !hasAnyRole(operator, TIMETABLE_ADMIN_ROLES)) {
    return { error: "進行状況を変更する権限がありません。", isSaved: false };
  }

  const raw = formData.get("program");
  if (typeof raw !== "string") {
    return { error: "種目を選択してください。", isSaved: false };
  }

  // "" is 開始前 and is stored as NULL; FINISHED marks the day as over.
  const programId = raw === "" ? null : raw;
  if (
    programId !== null &&
    programId !== FINISHED &&
    programItem(programId) === undefined
  ) {
    return { error: "種目を選択してください。", isSaved: false };
  }

  try {
    await setProgress(programId);
  } catch {
    return { error: "進行状況の保存に失敗しました。", isSaved: false };
  }

  revalidatePath("/");
  revalidatePath("/timetable");
  revalidatePath("/timetable/edit");
  return { error: null, isSaved: true };
}
