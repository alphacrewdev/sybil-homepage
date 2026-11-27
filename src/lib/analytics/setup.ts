// This build's single analytics path, from the build environment (Astro-only; the logic is in gtm.ts).
// PUBLIC_GTM_CONTAINER_ID wins over PUBLIC_GA_MEASUREMENT_ID; preview builds (non-root base) get none.
import { base } from "../base";
import { resolveAnalytics } from "./gtm";

export const analyticsSetup = resolveAnalytics({
  gtmId: import.meta.env.PUBLIC_GTM_CONTAINER_ID,
  gaId: import.meta.env.PUBLIC_GA_MEASUREMENT_ID,
  preview: base !== "/",
});
