// How a visitor enrolls, one explicit mode per product.
//
// "inquiry": there is no verified self-pay checkout on the new platform yet
// (roadmap item in the Nov 1, 2026 platform summary), so every product sends
// the visitor to the contact flow with the course pre-selected. When a
// product's checkout is verified end to end (SKU, price, receipt, entitlement),
// add a "checkout" mode here for that product only; nothing else changes.
import { withBase } from "./base";

export type Enrollment =
  | { mode: "inquiry"; label: string; href: string; note: string }
  | { mode: "checkout"; label: string; href: string; note: string };

export const contactHref = (query: Record<string, string> = {}) => {
  const qs = new URLSearchParams(query).toString();
  return withBase(`/contact/${qs ? `?${qs}` : ""}#contact-form`);
};

/** Program consult: the one destination every "Schedule a consult" button uses. */
export const consultHref = contactHref({ intent: "program" });

export function enrollmentFor(slug: string): Enrollment {
  return {
    mode: "inquiry",
    label: "Ask about enrollment",
    href: contactHref({ intent: "individual", course: slug }),
    note: "Contact us for current pricing and access details.",
  };
}
