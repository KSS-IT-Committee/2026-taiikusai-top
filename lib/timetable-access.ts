import "server-only";

import type { Role } from "@/lib/access";

/**
 * Who may move the 進行状況 marker. IT alone for 2026 — widen this when the
 * 体育祭 committee takes it over. Named once so the page guard and the server
 * action that re-checks every submission cannot drift apart.
 */
export const TIMETABLE_ADMIN_ROLES: readonly Role[] = ["IT"];
