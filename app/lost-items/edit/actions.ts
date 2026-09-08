"use server";

import { revalidatePath } from "next/cache";

import { addLostItem } from "@/db/addLostItem";
import { deleteLostItem } from "@/db/deleteLostItem";
import { hasAnyRole } from "@/lib/access";
import {
  isAllowedImageType,
  looksLikeImageType,
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
  if (!isAllowedImageType(image.type)) {
    return {
      error: "写真はJPEG・PNG・WebPのいずれかにしてください。",
      message: null,
    };
  }

  const imageBytes = Buffer.from(await image.arrayBuffer());
  if (!looksLikeImageType(imageBytes, image.type)) {
    return {
      error:
        "写真のファイル形式が拡張子と一致しません。iPhoneのHEIC形式などは、JPEGに変換してからアップロードしてください。",
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

  try {
    await addLostItem({
      description: description === "" ? null : description,
      contentType: image.type,
      imageBytes,
      uploadedBy: operator.username,
    });
  } catch {
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

  try {
    await deleteLostItem(Number(rawId));
  } catch {
    return { error: "忘れ物の削除に失敗しました。", message: null };
  }

  revalidate();
  return { error: null, message: "忘れ物を削除しました。" };
}
