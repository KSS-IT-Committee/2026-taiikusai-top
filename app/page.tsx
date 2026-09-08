import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Internal } from "@/app/components/Internal";
import { ScoreTable } from "@/app/components/ScoreTable";
import { SCORE_ADMIN_ROLES } from "@/lib/score-access";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "2026体育祭",
  description: "今日、勝ちにきました",
};

// 後期予備大の順位。1位から4位の順に組を並べる。
const KOUKI_RESULTS = [
  { sport: "サッカー", ranking: ["D組", "B組", "C組", "A組"] },
  { sport: "アルティメット", ranking: ["B組", "C組", "A組", "D組"] },
  { sport: "ドッヂボール女子", ranking: ["D組", "A組", "B組", "C組"] },
  { sport: "ドッヂボール男子", ranking: ["B組", "C組", "D組", "A組"] },
  { sport: "バスケットボール女子", ranking: ["A組", "C組", "B組", "D組"] },
  { sport: "バスケットボール男子", ranking: ["D組", "A組", "C組", "B組"] },
  { sport: "バレーボール女子", ranking: ["D組", "C組", "A組", "B組"] },
  { sport: "バレーボール男子", ranking: ["A組", "C組", "D組", "B組"] },
];

const RANK_LABELS = ["1位", "2位", "3位", "4位"];

// The wrapper scrolls sideways on narrow screens, so it takes focus and a
// name of its own — otherwise the off-screen columns are reachable by
// pointer only.
function ResultTable({
  label,
  results,
}: {
  label: string;
  results: { sport: string; ranking: string[] }[];
}) {
  return (
    <div
      className={styles.tableScroll}
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      <table className={styles.resultTable}>
        <thead>
          <tr>
            <th scope="col">種目</th>
            {RANK_LABELS.map((label) => (
              <th key={label} scope="col">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map(({ sport, ranking }) => (
            <tr key={sport}>
              <th scope="row">{sport}</th>
              {ranking.map((group, index) => (
                <td key={RANK_LABELS[index]}>{group}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Toppage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.themeContainer}>
          <Image
            src="/sports-theme.svg"
            alt="今日、勝ちにきました"
            width={600}
            height={100}
            className={styles.theme}
            priority
          />
        </div>
        <span className={styles.headerText}>体育祭2026</span>
      </header>
      <div className={styles.container}>
        <div className={styles.scores}>
          <h1
            className={`${styles.title} ${styles.titleLine} ${styles.lineBlue}`}
          >
            得点表
          </h1>
          <ScoreTable />
          <Internal role={SCORE_ADMIN_ROLES}>
            <Link className={styles.editLink} href="/score/edit">
              得点を入力する
            </Link>
          </Internal>
        </div>
        <div className={styles.yobitai}>
          <h1
            className={`${styles.title} ${styles.titleLine} ${styles.lineBlue}`}
          >
            予備大結果
          </h1>
          <div className={styles.topics}>
            <h2
              className={`${styles.topicsTitle} ${styles.titleLine} ${styles.linePink}`}
            >
              前期
            </h2>
            <p className={styles.pending}>後日改めて公開します。</p>
          </div>
          <div className={styles.topics}>
            <h2
              className={`${styles.topicsTitle} ${styles.titleLine} ${styles.linePink}`}
            >
              後期
            </h2>
            <ResultTable label="後期予備大結果" results={KOUKI_RESULTS} />
          </div>
        </div>
      </div>
    </>
  );
}
