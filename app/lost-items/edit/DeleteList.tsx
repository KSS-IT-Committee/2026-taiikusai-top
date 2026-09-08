"use client";

import Image from "next/image";
import { useActionState } from "react";

import type { LostItem } from "@/db/getLostItems";

import { deleteLostItemAction, type LostItemFormState } from "./actions";
import styles from "./edit.module.css";

const INITIAL_STATE: LostItemFormState = {
  error: null,
  message: null,
};

export function DeleteList({ items }: { items: LostItem[] }) {
  const [state, formAction, isPending] = useActionState(
    deleteLostItemAction,
    INITIAL_STATE,
  );

  if (items.length === 0) {
    return <p className={styles.empty}>まだ何も掲載されていません。</p>;
  }

  return (
    <>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.row}>
            <div className={styles.thumbFrame}>
              <Image
                src={`/api/lost-items/${item.id}`}
                alt={item.description ?? "忘れ物の写真"}
                fill
                sizes="72px"
                className={styles.thumb}
              />
            </div>
            <div className={styles.rowText}>
              <p className={styles.rowDescription}>
                {item.description ?? "（説明なし）"}
              </p>
              <p className={styles.rowMeta}>{item.uploadedBy}</p>
            </div>
            <form action={formAction}>
              <input type="hidden" name="id" value={item.id} />
              <button
                className={styles.deleteButton}
                type="submit"
                disabled={isPending}
              >
                削除
              </button>
            </form>
          </li>
        ))}
      </ul>
      {state.error !== null && (
        <p className={styles.formStatus} role="alert">
          {state.error}
        </p>
      )}
      {state.message !== null && (
        <p className={styles.formStatus} role="status">
          {state.message}
        </p>
      )}
    </>
  );
}
