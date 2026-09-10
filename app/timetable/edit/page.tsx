import type { Metadata } from "next";

import { AuthGuard } from "@/app/components/AuthGuard";
import { FloatingMenu } from "@/app/components/FloatingMenu";
import { getProgress } from "@/db/getProgress";
import { pageMetadata } from "@/lib/site";
import { TIMETABLE_ADMIN_ROLES } from "@/lib/timetable-access";

import styles from "./edit.module.css";
import { ProgressForm } from "./ProgressForm";

export const metadata: Metadata = pageMetadata({
  title: "進行状況の更新",
  description: "体育祭2026の進行状況を更新するページ",
  isIndexable: false,
});

// The marker is read inside the guard, so a visitor without the role never
// reaches the database and still gets a real 403.
export default function ProgressEditPage() {
  return (
    <AuthGuard role={TIMETABLE_ADMIN_ROLES}>
      <ProgressEditContent />
    </AuthGuard>
  );
}

async function ProgressEditContent() {
  const row = await getProgress();
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>進行状況の更新</h1>
      <p className={styles.intro}>
        今行っている種目を選んで更新してください。更新した時刻とルールブックの開始時刻の差が、そのまま「◯分押し」として表示されます。
      </p>
      <ProgressForm programId={row?.programId ?? null} />
      <FloatingMenu
        items={[
          { label: "Top", href: "/" },
          { label: "Timetable", href: "/timetable" },
        ]}
      />
    </div>
  );
}
