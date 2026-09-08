import "server-only";

import type { Role } from "@/lib/access";

/**
 * Who may edit the 得点表. IT alone for 2026 — widen this when the 体育祭
 * committee takes the input over. Named once so the page guard and the server
 * action that re-checks every submission cannot drift apart.
 */
export const SCORE_ADMIN_ROLES: readonly Role[] = ["IT"];
