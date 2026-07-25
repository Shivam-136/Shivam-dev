/**
 * Always scroll through Lenis, never via native scrollIntoView / anchor jump.
 * Mixing native scroll with Lenis's RAF-driven scroll is what causes
 * ScrollTrigger to fire mid-animation and leave elements stuck half-transformed.
 */
export function smoothScrollTo(hash, opts = {}) {
  if (!hash) return;
  const target = document.querySelector(hash);
  if (!target) return;

  if (window.lenis) {
    window.lenis.scrollTo(target, { offset: 0, duration: 1.2, ...opts });
  } else {
    // Fallback only if Lenis hasn't mounted yet
    target.scrollIntoView({ behavior: "smooth" });
  }

  // keep the URL hash in sync without triggering a native jump
  if (window.history?.replaceState) {
    window.history.replaceState(null, "", hash);
  }
}