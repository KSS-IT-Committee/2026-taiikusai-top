"use client";

import { useActionState } from "react";

import { FINISHED, PROGRAM, programLabel, timeRange } from "@/lib/timetable";

import { type ProgressFormState, submitProgressAction } from "./actions";
import styles from "./edit.module.css";

const INITIAL_STATE: ProgressFormState = {
  error: null,
  isSaved: false,
};

export function ProgressForm({ programId }: { programId: string | null }) {
  const [state, formAction, isPending] = useActionState(
    submitProgressAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.label} htmlFor="program">
        今の種目
      </label>
      <select
        id="program"
        name="program"
        className={styles.select}
        defaultValue={programId ?? ""}
      >
        <option value="">開始前</option>
        {PROGRAM.map((item) => (
          <option key={item.id} value={item.id}>
            {programLabel(item)}（{timeRange(item)}）
          </option>
        ))}
        <option value={FINISHED}>終了</option>
      </select>
      <button
        className={styles.submitButton}
        type="submit"
        disabled={isPending}
      >
        {isPending ? "更新中…" : "更新"}
      </button>
      {state.error !== null && (
        <p className={styles.formStatus} role="alert">
          {state.error}
        </p>
      )}
      {state.isSaved && (
        <p className={styles.formStatus} role="status">
          進行状況を更新しました。
        </p>
      )}
    </form>
  );
}
