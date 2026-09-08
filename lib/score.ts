/**
 * The 本大会 program and the four 団, as printed in the R8 ルールブック. Shared
 * by the public 得点表 and the committee's edit form so both agree on which
 * rows exist, in what order, and under which name.
 */

export const TEAMS = [
  { id: "blue", name: "青" },
  { id: "red", name: "赤" },
  { id: "green", name: "緑" },
  { id: "white", name: "白" },
] as const;

export type TeamId = (typeof TEAMS)[number]["id"];

/** One row of the 得点表: a program number plus a score per 団. */
export type ProgramScore = { program: number } & Record<TeamId, number | null>;

type Program = {
  number: number;
  name: string;
  entrants: string;
};

// Program numbers come from the rulebook, so 競技9 部活動対抗リレー is missing
// on purpose — it is the one program whose result is not added to the 団 score.
export const PROGRAMS: readonly Program[] = [
  { number: 1, name: "ハリケーン", entrants: "1年" },
  { number: 2, name: "学年リレー", entrants: "3年" },
  { number: 3, name: "筏流し", entrants: "2年" },
  { number: 4, name: "学年リレー", entrants: "5年" },
  { number: 5, name: "小ムカデ", entrants: "3年" },
  { number: 6, name: "学年リレー", entrants: "6年" },
  { number: 7, name: "ローハイド", entrants: "4年" },
  { number: 8, name: "２人３脚玉入れ", entrants: "5年" },
  { number: 10, name: "応援ダンス", entrants: "後期生" },
  { number: 11, name: "学年リレー", entrants: "1年" },
  { number: 12, name: "学年リレー", entrants: "2年" },
  { number: 13, name: "棒引き女子", entrants: "6年女子" },
  { number: 14, name: "棒引き男子", entrants: "6年男子" },
  { number: 15, name: "学年リレー", entrants: "4年" },
  { number: 16, name: "前期綱引き", entrants: "前期共通" },
  { number: 17, name: "騎馬戦女子", entrants: "後期選抜女子" },
  { number: 18, name: "騎馬戦男子", entrants: "後期選抜男子" },
  { number: 19, name: "色別リレー", entrants: "全学年選抜" },
];

// 色別リレーの1位が300点、騎馬戦は2試合の合計なのでそれより伸びる。上限は
// 入力ミスを弾くためだけのものなので、ルール上ありえない桁で切っている。
export const MAX_SCORE = 999;

export function sumByTeam(
  scores: readonly ProgramScore[],
): Record<TeamId, number> {
  const totals: Record<TeamId, number> = {
    blue: 0,
    red: 0,
    green: 0,
    white: 0,
  };
  for (const score of scores) {
    for (const team of TEAMS) {
      totals[team.id] += score[team.id] ?? 0;
    }
  }
  return totals;
}
