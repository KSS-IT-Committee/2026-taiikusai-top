import type { Metadata } from "next";

import { AuthGuard } from "@/app/components/AuthGuard";
import { FloatingMenu } from "@/app/components/FloatingMenu";
import { getLostItems } from "@/db/getLostItems";
import { LOST_ITEM_ADMIN_ROLES } from "@/lib/lost-items-access";
import { pageMetadata } from "@/lib/site";

import { DeleteList } from "./DeleteList";
import styles from "./edit.module.css";
import { UploadForm } from "./UploadForm";

export const metadata: Metadata = pageMetadata({
  title: "忘れ物の追加",
  description: "体育祭2026の忘れ物を掲載するページ",
  isIndexable: false,
});

// The board is read inside the guard, so a visitor without the role never
// reaches the database and still gets a real 403.
export default function LostItemsEditPage() {
  return (
    <AuthGuard role={LOST_ITEM_ADMIN_ROLES}>
      <LostItemsEditContent />
    </AuthGuard>
  );
}

async function LostItemsEditContent() {
  const items = await getLostItems();
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>忘れ物の追加</h1>
      <p className={styles.intro}>
        追加した写真と説明は、そのまま公開の忘れ物ページに並びます。持ち主が見つかったものは削除してください。
      </p>
      <UploadForm />
      <h2 className={styles.sectionTitle}>掲載中の忘れ物</h2>
      <DeleteList items={items} />
      <FloatingMenu
        items={[
          { label: "Top", href: "/" },
          { label: "忘れ物", href: "/lost-items" },
        ]}
      />
    </div>
  );
}
