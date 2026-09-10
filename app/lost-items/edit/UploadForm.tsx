"use client";

import { useActionState } from "react";

import {
  ALLOWED_IMAGE_LABEL,
  IMAGE_ACCEPT,
  MAX_DESCRIPTION_LENGTH,
  MAX_IMAGE_BYTES,
} from "@/lib/lost-items";

import { type LostItemFormState, submitLostItemAction } from "./actions";
import styles from "./edit.module.css";

const INITIAL_STATE: LostItemFormState = {
  error: null,
  message: null,
};

export function UploadForm() {
  const [state, formAction, isPending] = useActionState(
    submitLostItemAction,
    INITIAL_STATE,
  );
  const megabytes = Math.floor(MAX_IMAGE_BYTES / 1024 / 1024);

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="image">
          写真
        </label>
        <input
          id="image"
          type="file"
          name="image"
          accept={IMAGE_ACCEPT}
          required
        />
        <p className={styles.hint}>
          {ALLOWED_IMAGE_LABEL}、{megabytes}MBまで。
        </p>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="description">
          説明（任意）
        </label>
        <input
          id="description"
          type="text"
          name="description"
          className={styles.input}
          maxLength={MAX_DESCRIPTION_LENGTH}
          placeholder="例：グラウンドで見つかった水筒"
        />
      </div>
      <button
        className={styles.submitButton}
        type="submit"
        disabled={isPending}
      >
        {isPending ? "追加中…" : "追加"}
      </button>
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
    </form>
  );
}
