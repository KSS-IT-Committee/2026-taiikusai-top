import { getScores } from "@/db/getScores";
import { PROGRAMS, sumByTeam, TEAMS } from "@/lib/score";

import styles from "./ScoreTable.module.css";

/**
 * The live 本大会 score board. Rows follow the rulebook's program order; a
 * program the committee has not entered yet shows a dash rather than a zero,
 * so the total only counts what has actually been run.
 */
export async function ScoreTable() {
  const scores = await getScores();
  const scoreByProgram = new Map(scores.map((score) => [score.program, score]));
  const listed = PROGRAMS.map((program) =>
    scoreByProgram.get(program.number),
  ).filter((score) => score !== undefined);
  const totals = sumByTeam(listed);

  return (
    <div className={styles.scroll}>
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
                  {program.number}. {program.name}
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
  );
}
