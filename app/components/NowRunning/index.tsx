import Link from "next/link";

import { getProgress } from "@/db/getProgress";
import {
  formatDelay,
  programLabel,
  type Progress,
  resolveProgress,
  timeRange,
} from "@/lib/timetable";

import styles from "./NowRunning.module.css";

/**
 * The 今開催中 strip for the top page: whichever program the committee has
 * marked as running, how far behind the printed time that put the day, and
 * what comes next. The full board lives on /timetable.
 */
export async function NowRunning() {
  const row = await getProgress();
  const progress = resolveProgress(
    row?.programId ?? null,
    row?.updatedAt ?? null,
  );

  return (
    <div className={styles.strip}>
      <Body progress={progress} />
      <Link className={styles.link} href="/timetable">
        タイムテーブル
      </Link>
    </div>
  );
}

function Body({ progress }: { progress: Progress }) {
  if (progress.kind === "before") {
    return <p className={styles.idle}>体育祭はまだ始まっていません。</p>;
  }
  if (progress.kind === "finished") {
    return <p className={styles.idle}>本日の競技はすべて終了しました。</p>;
  }
  return (
    <>
      <p className={styles.current}>
        <span className={styles.badge}>開催中</span>
        <span className={styles.name}>{programLabel(progress.item)}</span>
        <span className={styles.time}>{timeRange(progress.item)}</span>
        {progress.delayMinutes !== null && (
          <span
            className={`${styles.delay} ${
              progress.delayMinutes === 0 ? styles.onTime : ""
            }`}
          >
            {formatDelay(progress.delayMinutes)}
          </span>
        )}
      </p>
      {progress.next !== null && (
        <p className={styles.next}>
          次は {programLabel(progress.next)}（{timeRange(progress.next)}）
        </p>
      )}
    </>
  );
}
