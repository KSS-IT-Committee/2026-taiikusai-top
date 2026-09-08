"use client";

import { useActionState } from "react";

import { MAX_SCORE, PROGRAMS, type ProgramScore, TEAMS } from "@/lib/score";

import { type ScoreFormState, submitScoresAction } from "./actions";
import styles from "./edit.module.css";

const INITIAL_STATE: ScoreFormState = {
  error: null,
  isSaved: false,
};

export function ScoreForm({ scores }: { scores: ProgramScore[] }) {
  const [state, formAction, isPending] = useActionState(
    submitScoresAction,
    INITIAL_STATE,
  );
  const scoreByProgram = new Map(scores.map((score) => [score.program, score]));

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">競技</th>
              {TEAMS.map((team) => (
                <th key={team.id} scope="col">
                  {team.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROGRAMS.map((program) => {
              const score = scoreByProgram.get(program.number);
              return (
                <tr key={program.number}>
                  <th scope="row">
                    {program.number}. {program.name}
                    <span className={styles.entrants}>{program.entrants}</span>
                  </th>
                  {TEAMS.map((team) => (
                    <td key={team.id}>
                      <input
                        type="number"
                        name={`${program.number}-${team.id}`}
                        className={styles.input}
                        aria-label={`${program.name}（${program.entrants}）${team.name}`}
                        defaultValue={score?.[team.id] ?? ""}
                        min={0}
                        max={MAX_SCORE}
                        step={1}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        className={styles.submitButton}
        type="submit"
        disabled={isPending}
      >
        {isPending ? "保存中…" : "保存"}
      </button>
      {state.error !== null && (
        <p className={styles.formStatus} role="alert">
          {state.error}
        </p>
      )}
      {state.isSaved && (
        <p className={styles.formStatus} role="status">
          得点を保存しました。
        </p>
      )}
    </form>
  );
}
