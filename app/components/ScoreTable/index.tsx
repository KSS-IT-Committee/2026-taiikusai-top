import { getScores } from "@/db/getScores";
import {
  programLabel,
  PROGRAMS,
  rankByTeam,
  sumByTeam,
  TEAMS,
} from "@/lib/score";

import styles from "./ScoreTable.module.css";

/**
 * The live score board: each 団's running total up top, the 予備大 and the
 * rulebook's programs broken down underneath. A program the committee has not
 * entered yet shows a dash rather than a zero, so the total only counts what
 * has actually been run.
 */
export async function ScoreTable() {
  const scores = await getScores();
  const scoreByProgram = new Map(scores.map((score) => [score.program, score]));
  const listed = PROGRAMS.map((program) =>
    scoreByProgram.get(program.number),
  ).filter((score) => score !== undefined);
  const totals = sumByTeam(listed);
  const ranks = rankByTeam(totals);

  return (
    <>
      <div className={styles.summary}>
        {TEAMS.map((team) => (
          <div key={team.id} className={`${styles.team} ${styles[team.id]}`}>
            <span className={styles.teamName}>{team.name}</span>
            <span className={styles.teamScore}>{totals[team.id]}</span>
            <span className={styles.teamRank}>{ranks[team.id]}位</span>
          </div>
        ))}
      </div>
      {/* Nothing inside takes focus, so the wrapper does — otherwise the
          columns it scrolls out of view on a narrow screen are pointer-only. */}
      <div
        className={styles.scroll}
        role="region"
        aria-label="競技ごとの得点"
        tabIndex={0}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">競技</th>
              {TEAMS.map((team) => (
                <th key={team.id} scope="col" className={styles[team.id]}>
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
                    {programLabel(program)}
                    <span className={styles.entrants}>{program.entrants}</span>
                  </th>
                  {TEAMS.map((team) => (
                    <td key={team.id}>{score?.[team.id] ?? "-"}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">合計</th>
              {TEAMS.map((team) => (
                <td key={team.id}>{totals[team.id]}</td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
