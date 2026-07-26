
export function smoothScrollTo(hash, opts = {}) {
  if (!hash) return;
  const target = document.querySelector(hash);
  if (!target) return;

  if (window.lenis) {
    window.lenis.scrollTo(target, { offset: 0, duration: 1.2, ...opts });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }

  if (window.history?.replaceState) {
    window.history.replaceState(null, "", hash);
  }
}