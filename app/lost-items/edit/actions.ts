"use server";

import { createHash } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";

import { addLostItem } from "@/db/addLostItem";
import { deleteLostItem } from "@/db/deleteLostItem";
import { hasAnyRole } from "@/lib/access";
import { detectImageType, lostItemImagesDir } from "@/lib/lost-item-images";
import {
  ALLOWED_IMAGE_LABEL,
  MAX_DESCRIPTION_LENGTH,
  MAX_IMAGE_BYTES,
} from "@/lib/lost-items";
import { LOST_ITEM_ADMIN_ROLES } from "@/lib/lost-items-access";
import { getCurrentUser } from "@/lib/session";

export type LostItemFormState = {
  error: string | null;
  message: string | null;
};

async function operatorOrNull() {
  const operator = await getCurrentUser();
  if (operator === null || !hasAnyRole(operator, LOST_ITEM_ADMIN_ROLES)) {
    return null;
  }
  return operator;
}

function revalidate() {
  revalidatePath("/lost-items");
  revalidatePath("/lost-items/edit");
}

/**
 * Writes the photo onto the persistent mount under a content-addressed name:
 * the SHA-256 of the bytes plus the extension the bytes themselves imply. Two
 * uploads collide on a name only when they are the same picture, which is what
 * lets the serving route mark these URLs immutable.
 */
async function saveImage(bytes: Buffer, ext: string): Promise<string> {
  const fileName = `${createHash("sha256").update(bytes).digest("hex")}${ext}`;
  const dir = lostItemImagesDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), bytes);
  return fileName;
}

export async function submitLostItemAction(
  _previousState: LostItemFormState,
  formData: FormData,
): Promise<LostItemFormState> {
  const operator = await operatorOrNull();
  if (operator === null) {
    return { error: "忘れ物を追加する権限がありません。", message: null };
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return { error: "写真を選んでください。", message: null };
  }
  if (image.size > MAX_IMAGE_BYTES) {
    const limit = Math.floor(MAX_IMAGE_BYTES / 1024 / 1024);
    return { error: `写真は${limit}MBまでです。`, message: null };
  }

  // The browser's Content-Type comes from the file extension, so it is only a
  // hint — the bytes decide. A renamed HEIC (what phones produce) lands here
  // labelled image/jpeg and is turned away rather than published unviewable.
  const bytes = Buffer.from(await image.arrayBuffer());
  const detected = detectImageType(bytes);
  if (detected === null) {
    return {
      error: `写真は${ALLOWED_IMAGE_LABEL}のいずれかにしてください。iPhoneのHEIC形式は、JPEGに変換してからアップロードしてください。`,
      message: null,
    };
  }

  const rawDescription = formData.get("description");
  const description =
    typeof rawDescription === "string" ? rawDescription.trim() : "";
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      error: `説明は${MAX_DESCRIPTION_LENGTH}文字までです。`,
      message: null,
    };
  }

  let fileName: string;
  try {
    fileName = await saveImage(bytes, detected.ext);
  } catch (err) {
    console.error("忘れ物の写真の保存に失敗しました:", err);
    return { error: "写真の保存に失敗しました。", message: null };
  }

  try {
    await addLostItem({
      description: description === "" ? null : description,
      fileName,
      uploadedBy: operator.username,
    });
  } catch (err) {
    console.error("忘れ物の追加に失敗しました:", err);
    // Deliberately NOT unlinking the file here. Names are the hash of the
    // bytes, so posting a photo that is already on the board writes the very
    // same file — and cleaning up after a failed insert would take it away
    // from the row that is already using it. An orphan costs a few hundred KB
    // and is reused verbatim by the next identical upload; nothing references
    // it, so it appears on no page.
    return { error: "忘れ物の追加に失敗しました。", message: null };
  }

  revalidate();
  return { error: null, message: "忘れ物を追加しました。" };
}

export async function deleteLostItemAction(
  _previousState: LostItemFormState,
  formData: FormData,
): Promise<LostItemFormState> {
  const operator = await operatorOrNull();
  if (operator === null) {
    return { error: "忘れ物を削除する権限がありません。", message: null };
  }

  const rawId = formData.get("id");
  if (typeof rawId !== "string" || !/^\d+$/.test(rawId)) {
    return { error: "削除する忘れ物が指定されていません。", message: null };
  }
  // The digits still have to land on a real id. Without this, "0" matches no
  // row yet still reports success, and anything past 2^53 either rounds onto a
  // different id or reaches Postgres as 1e+21, which an int4 cannot parse.
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { error: "削除する忘れ物が指定されていません。", message: null };
  }

  let deleted: Awaited<ReturnType<typeof deleteLostItem>>;
  try {
    deleted = await deleteLostItem(id);
  } catch (err) {
    console.error("忘れ物の削除に失敗しました:", err);
    return { error: "忘れ物の削除に失敗しました。", message: null };
  }

  // The row goes first: an orphaned file wastes a little disk, whereas a row
  // pointing at a file that is already gone is a broken picture on a public
  // page. Only the last row referencing a name may take the file with it.
  if (deleted !== null && deleted.remainingRefs === 0) {
    await unlinkQuietly(deleted.fileName);
  }

  revalidate();
  return { error: null, message: "忘れ物を削除しました。" };
}

async function unlinkQuietly(fileName: string) {
  const dir = path.resolve(lostItemImagesDir());
  // basename() drops any directory parts, so this can only ever resolve to a
  // file directly inside the images dir — no traversal possible.
  const filePath = path.resolve(dir, path.basename(fileName));
  if (path.dirname(filePath) !== dir) return;

  try {
    await unlink(filePath);
  } catch (err) {
    // An already-missing file is fine; surface anything else without failing
    // the request the operator just completed.
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("写真ファイルの削除に失敗しました:", err);
    }
  }
}
