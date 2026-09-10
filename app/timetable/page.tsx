import type { Metadata } from "next";
import Link from "next/link";

import { FloatingMenu } from "@/app/components/FloatingMenu";
import { Internal } from "@/app/components/Internal";
import { getProgress } from "@/db/getProgress";
import { pageMetadata } from "@/lib/site";
import {
  barPosition,
  DAY_HOURS,
  FESTIVAL_DATE_LABEL,
  formatDelay,
  HOUR_TICKS,
  PROGRAM,
  type ProgramItem,
  programLabel,
  type Progress,
  resolveProgress,
  timeRange,
} from "@/lib/timetable";
import { TIMETABLE_ADMIN_ROLES } from "@/lib/timetable-access";

import styles from "./timetable.module.css";

export const metadata: Metadata = pageMetadata({
  title: "タイムテーブル",
  description:
    "体育祭2026 本大会のタイムテーブル。全19競技と開会式・閉会式の時程、当日の進行状況。",
  path: "/timetable",
});

export default async function TimetablePage() {
  const row = await getProgress();
  const progress = resolveProgress(
    row?.programId ?? null,
    row?.updatedAt ?? null,
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.romaji}>Timetable</p>
        <h1 className={styles.title}>タイムテーブル</h1>
      </header>
      <section className={styles.overview}>
        <p className={styles.eyebrow}>Event information</p>
        <h2>開催日時</h2>
        <p className={styles.festivalDate}>{FESTIVAL_DATE_LABEL}</p>
        <dl className={styles.hours}>
          {DAY_HOURS.map((hour) => (
            <div key={hour.label}>
              <dt>{hour.label}</dt>
              <dd>{hour.time}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.note}>
          時程は雨天や競技の進み具合によって前後します。当日の進行状況は下の「現在の進行」でお知らせします。
        </p>
      </section>
      <section className={styles.timetable} aria-labelledby="timetable-heading">
        <div className={styles.timetableIntro}>
          <p className={styles.eyebrow}>Program timetable</p>
          <h2 id="timetable-heading">競技タイムテーブル</h2>
          <p>ルールブックのプログラム順です。</p>
          <div className={styles.status}>
            <span className={styles.statusLabel}>現在の進行</span>
            <Status progress={progress} />
          </div>
          <Internal role={TIMETABLE_ADMIN_ROLES}>
            <Link className={styles.editLink} href="/timetable/edit">
              進行状況を更新する
            </Link>
          </Internal>
        </div>
        <Timeline progress={progress} />
      </section>
      <FloatingMenu items={[{ label: "Top", href: "/" }]} />
    </div>
  );
}

function Status({ progress }: { progress: Progress }) {
  if (progress.kind === "before") {
    return <span className={styles.statusProgram}>まだ始まっていません</span>;
  }
  if (progress.kind === "finished") {
    return <span className={styles.statusProgram}>すべて終了しました</span>;
  }
  return (
    <>
      <span className={styles.statusProgram}>
        {programLabel(progress.item)}
      </span>
      <span className={styles.statusTime}>{timeRange(progress.item)}</span>
      {progress.delayMinutes !== null && (
        <span
          className={`${styles.delay} ${
            progress.delayMinutes === 0 ? styles.onTime : ""
          }`}
        >
          {formatDelay(progress.delayMinutes)}
        </span>
      )}
      {progress.next !== null && (
        <span className={styles.statusTime}>
          次は {programLabel(progress.next)}（{timeRange(progress.next)}）
        </span>
      )}
    </>
  );
}

function Timeline({ progress }: { progress: Progress }) {
  // Everything above the marked program has already been run; "finished" puts
  // the marker past the end so the whole board reads as done.
  const currentIndex =
    progress.kind === "running"
      ? PROGRAM.indexOf(progress.item)
      : progress.kind === "finished"
        ? PROGRAM.length
        : -1;

  return (
    // The board scrolls sideways on a narrow screen and nothing inside it
    // takes focus, so the wrapper does.
    <div
      className={styles.timeline}
      role="region"
      aria-label="競技タイムテーブル"
      tabIndex={0}
    >
      <div className={styles.timelineHeader}>
        <span className={styles.timelineLabel}>競技</span>
        <div className={styles.timeScale}>
          {HOUR_TICKS.map((tick) => (
            <time key={tick.label} style={{ left: tick.left }}>
              {tick.label}
            </time>
          ))}
        </div>
      </div>
      <div className={styles.timelineBody}>
        {PROGRAM.map((item, index) => (
          <TimelineRow
            key={item.id}
            item={item}
            isCurrent={index === currentIndex}
            isDone={index < currentIndex}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineRow({
  item,
  isCurrent,
  isDone,
}: {
  item: ProgramItem;
  isCurrent: boolean;
  isDone: boolean;
}) {
  const rowClass = isCurrent ? styles.currentRow : isDone ? styles.doneRow : "";

  return (
    <div className={`${styles.timelineRow} ${rowClass}`}>
      <div className={styles.timelineProgram}>
        <strong>
          {programLabel(item)}
          {isCurrent && <span className={styles.runningMark}>開催中</span>}
        </strong>
        <span>
          <time>{timeRange(item)}</time>
          {item.entrants && `　${item.entrants}`}
        </span>
      </div>
      {/* A 10-minute competition is barely 2% of the day, far too narrow to
          carry its own text — the bar is only where the row sits on the
          clock, and the label column beside it says the rest. */}
      <div className={styles.timelineTrack} aria-hidden="true">
        <div
          className={`${styles.timelineBar} ${
            item.kind === "break" ? styles.breakBar : ""
          }`}
          style={barPosition(item)}
        />
      </div>
    </div>
  );
}
