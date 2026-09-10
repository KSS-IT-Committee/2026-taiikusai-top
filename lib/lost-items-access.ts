import "server-only";

import type { Role } from "@/lib/access";

/**
 * Who may post to the 忘れ物 board. IT alone for now; issue #160 suggests
 * letting a few 体育委員 in too, which is a matter of adding "Taiikusai" here.
 * Named once so the page guard and the server actions that re-check every
 * submission cannot drift apart.
 */
export const LOST_ITEM_ADMIN_ROLES: readonly Role[] = ["IT"];
