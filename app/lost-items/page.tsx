import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FloatingMenu } from "@/app/components/FloatingMenu";
import { Internal } from "@/app/components/Internal";
import { getLostItems } from "@/db/getLostItems";
import { LOST_ITEM_ADMIN_ROLES } from "@/lib/lost-items-access";
import { pageMetadata } from "@/lib/site";

import styles from "./lost-items.module.css";

export const metadata: Metadata = pageMetadata({
  title: "忘れ物",
  description:
    "体育祭2026の忘れ物一覧。心当たりのある方は本部までお越しください。",
  path: "/lost-items",
});

export default async function LostItemsPage() {
  const items = await getLostItems();

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>忘れ物</h1>
      <p className={styles.lead}>
        会場で見つかった忘れ物です。心当たりのある方は本部までお越しください。
      </p>
      <Internal role={LOST_ITEM_ADMIN_ROLES}>
        <Link className={styles.editLink} href="/lost-items/edit">
          忘れ物を追加する
        </Link>
      </Internal>
      {items.length === 0 ? (
        <p className={styles.empty}>今のところ届いている忘れ物はありません。</p>
      ) : (
        <ul className={styles.grid}>
          {items.map((item) => (
            <li key={item.id} className={styles.card}>
              <div className={styles.frame}>
                <Image
                  src={`/api/lost-items/${item.id}`}
                  alt={item.description ?? "忘れ物の写真"}
                  fill
                  sizes="(max-width: 640px) 50vw, 240px"
                  className={styles.photo}
                />
              </div>
              {item.description && (
                <p className={styles.description}>{item.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
      <FloatingMenu items={[{ label: "Top", href: "/" }]} />
    </div>
  );
}
