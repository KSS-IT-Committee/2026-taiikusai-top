/**
 * The 本大会 running order, as printed in the R8 ルールブック (2026年9月9日).
 * Shared by the public timetable, the 今開催中 strip and the committee's
 * progress form, so all three name the programs identically.
 */

export const FESTIVAL_DATE = "2026-09-09";
export const FESTIVAL_DATE_LABEL = "2026年9月9日（水）";

export type ProgramKind = "competition" | "break" | "ceremony";

export type ProgramItem = {
  id: string;
  /** Rulebook competition number. The ceremonies and the break have none. */
  number?: number;
  name: string;
  entrants?: string;
  /** JST wall-clock, "HH:MM". */
  start: string;
  end: string;
  kind: ProgramKind;
};

export const PROGRAM: readonly ProgramItem[] = [
  {
    id: "opening",
    name: "開会式",
    entrants: "全学年",
    start: "09:40",
    end: "10:00",
    kind: "ceremony",
  },
  {
    id: "p1",
    number: 1,
    name: "ハリケーン",
    entrants: "1年",
    start: "10:00",
    end: "10:10",
    kind: "competition",
  },
  {
    id: "p2",
    number: 2,
    name: "学年リレー",
    entrants: "3年",
    start: "10:10",
    end: "10:20",
    kind: "competition",
  },
  {
    id: "p3",
    number: 3,
    name: "筏流し",
    entrants: "2年",
    start: "10:20",
    end: "10:30",
    kind: "competition",
  },
  {
    id: "p4",
    number: 4,
    name: "学年リレー",
    entrants: "5年",
    start: "10:30",
    end: "10:40",
    kind: "competition",
  },
  {
    id: "p5",
    number: 5,
    name: "小ムカデ",
    entrants: "3年",
    start: "10:40",
    end: "10:50",
    kind: "competition",
  },
  {
    id: "p6",
    number: 6,
    name: "学年リレー",
    entrants: "6年",
    start: "10:50",
    end: "11:00",
    kind: "competition",
  },
  {
    id: "p7",
    number: 7,
    name: "ローハイド",
    entrants: "4年",
    start: "11:00",
    end: "11:10",
    kind: "competition",
  },
  {
    id: "p8",
    number: 8,
    name: "２人３脚玉入れ",
    entrants: "5年",
    start: "11:10",
    end: "11:20",
    kind: "competition",
  },
  {
    id: "p9",
    number: 9,
    name: "部活動対抗リレー",
    entrants: "各部活",
    start: "11:20",
    end: "11:40",
    kind: "competition",
  },
  {
    id: "lunch",
    name: "昼休み",
    entrants: "昼食場所は自席",
    start: "11:40",
    end: "12:25",
    kind: "break",
  },
  {
    id: "p10",
    number: 10,
    name: "応援ダンス",
    entrants: "後期生",
    start: "12:25",
    end: "12:45",
    kind: "competition",
  },
  {
    id: "p11",
    number: 11,
    name: "学年リレー",
    entrants: "1年",
    start: "12:45",
    end: "12:55",
    kind: "competition",
  },
  {
    id: "p12",
    number: 12,
    name: "学年リレー",
    entrants: "2年",
    start: "12:55",
    end: "13:05",
    kind: "competition",
  },
  {
    id: "p13",
    number: 13,
    name: "棒引き女子",
    entrants: "6年女子",
    start: "13:05",
    end: "13:20",
    kind: "competition",
  },
  {
    id: "p14",
    number: 14,
    name: "棒引き男子",
    entrants: "6年男子",
    start: "13:20",
    end: "13:35",
    kind: "competition",
  },
  {
    id: "p15",
    number: 15,
    name: "学年リレー",
    entrants: "4年",
    start: "13:35",
    end: "13:45",
    kind: "competition",
  },
  {
    id: "p16",
    number: 16,
    name: "前期綱引き",
    entrants: "前期共通",
    start: "13:45",
    end: "14:05",
    kind: "competition",
  },
  {
    id: "p17",
    number: 17,
    name: "騎馬戦女子",
    entrants: "後期選抜女子",
    start: "14:05",
    end: "14:25",
    kind: "competition",
  },
  {
    id: "p18",
    number: 18,
    name: "騎馬戦男子",
    entrants: "後期選抜男子",
    start: "14:25",
    end: "14:45",
    kind: "competition",
  },
  {
    id: "p19",
    number: 19,
    name: "色別リレー",
    entrants: "全学年選抜",
    start: "14:45",
    end: "15:05",
    kind: "competition",
  },
  {
    id: "closing",
    name: "閉会式",
    entrants: "全学年",
    start: "15:15",
    end: "15:30",
    kind: "ceremony",
  },
  {
    id: "photo",
    name: "各団写真撮影",
    entrants: "各団",
    start: "15:30",
    end: "16:00",
    kind: "ceremony",
  },
];

/**
 * The headline hours. The rulebook prints 午前の部 as ending at 11:35 while
 * its own program table runs 競技9 to 11:40; these follow the table, so the
 * page cannot contradict itself.
 */
export const DAY_HOURS = [
  { label: "開会式", time: "09:40" },
  { label: "午前の部", time: "10:00 - 11:40" },
  { label: "午後の部", time: "12:25 - 15:05" },
  { label: "閉会式", time: "15:15" },
];

/** Stored in place of a program id once the whole day is over. */
export const FINISHED = "finished";

export function programItem(id: string): ProgramItem | undefined {
  return PROGRAM.find((item) => item.id === id);
}

export function programLabel(item: ProgramItem): string {
  if (item.number === undefined) return item.name;
  return `${item.number}. ${item.name}`;
}

export function timeRange(item: ProgramItem): string {
  return `${item.start} - ${item.end}`;
}

function minutesOf(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/* The timeline's axis: 9:00 to 16:00, so its gridlines fall on whole hours. */
const AXIS_START = 9 * 60;
const AXIS_END = 16 * 60;
const AXIS_WIDTH = AXIS_END - AXIS_START;
const AXIS_HOURS = AXIS_WIDTH / 60;

export const HOUR_TICKS = Array.from({ length: AXIS_HOURS + 1 }, (_, index) => {
  const hour = AXIS_START / 60 + index;
  return {
    label: `${String(hour).padStart(2, "0")}:00`,
    left: `${((index * 60) / AXIS_WIDTH) * 100}%`,
  };
});

export function barPosition(item: ProgramItem) {
  const start = minutesOf(item.start);
  const end = minutesOf(item.end);
  return {
    left: `${((start - AXIS_START) / AXIS_WIDTH) * 100}%`,
    width: `${((end - start) / AXIS_WIDTH) * 100}%`,
  };
}

function scheduledStartAt(item: ProgramItem): Date {
  return new Date(`${FESTIVAL_DATE}T${item.start}:00+09:00`);
}

function isOnFestivalDay(at: Date): boolean {
  // en-CA renders as YYYY-MM-DD, and the explicit zone keeps the answer the
  // same whatever the container's clock is set to.
  return (
    at.toLocaleDateString("en-CA", { timeZone: "Asia/Tokyo" }) === FESTIVAL_DATE
  );
}

export type Progress =
  | { kind: "before" }
  | { kind: "finished" }
  | {
      kind: "running";
      item: ProgramItem;
      next: ProgramItem | null;
      /** Minutes behind schedule; negative is ahead. Null off the festival day. */
      delayMinutes: number | null;
    };

/**
 * What the stored marker means. `markedAt` is when the committee moved the
 * marker onto this program, so the gap between it and the program's printed
 * start time is how far the day is running behind — it stays put while the
 * program runs instead of creeping up minute by minute.
 */
export function resolveProgress(
  programId: string | null,
  markedAt: Date | null,
): Progress {
  if (programId === null) return { kind: "before" };
  if (programId === FINISHED) return { kind: "finished" };

  const index = PROGRAM.findIndex((item) => item.id === programId);
  if (index === -1) return { kind: "before" };

  const item = PROGRAM[index];
  const delayMinutes =
    markedAt !== null && isOnFestivalDay(markedAt)
      ? Math.round(
          (markedAt.getTime() - scheduledStartAt(item).getTime()) / 60_000,
        )
      : null;

  return {
    kind: "running",
    item,
    next: PROGRAM[index + 1] ?? null,
    delayMinutes,
  };
}

export function formatDelay(minutes: number): string {
  if (minutes > 0) return `${minutes}分押し`;
  if (minutes < 0) return `${-minutes}分巻き`;
  return "定刻どおり";
}
