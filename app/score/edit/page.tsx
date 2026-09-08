import type { Metadata } from "next";

import { AuthGuard } from "@/app/components/AuthGuard";
import { FloatingMenu } from "@/app/components/FloatingMenu";
import { getScores } from "@/db/getScores";
import { SCORE_ADMIN_ROLES } from "@/lib/score-access";

import styles from "./edit.module.css";
import { ScoreForm } from "./ScoreForm";

export const metadata: Metadata = {
  title: "得点入力 | 体育祭2026",
  description: "体育祭2026の得点入力ページ",
};

// The board is read inside the guard, so a visitor without the role never
// reaches the database and still gets a real 403.
export default function ScoreEditPage() {
  return (
    <AuthGuard role={SCORE_ADMIN_ROLES}>
      <ScoreEditContent />
    </AuthGuard>
  );
}

async function ScoreEditContent() {
  const scores = await getScores();
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>得点入力</h1>
      <p className={styles.intro}>
        入力した得点はそのままトップページの得点表に反映されます。まだ実施していない競技は空欄のままにしてください。
      </p>
      <ScoreForm scores={scores} />
      <FloatingMenu items={[{ label: "Top", href: "/" }]} />
    </div>
  );
}
