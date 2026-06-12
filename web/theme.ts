/**
 * Theme handshake. The browser demo can run standalone (light by default) or
 * embedded in Human OS, which tells it which palette to wear via a `?theme=`
 * query param on load and a `postMessage({ type: "humanos:theme", theme })` on
 * every toggle. Anything else is ignored.
 */

export function initTheme(): void {
  const param = new URLSearchParams(location.search).get("theme");
  apply(param === "dark" ? "dark" : "light");

  window.addEventListener("message", (e) => {
    const data = e.data as { type?: string; theme?: string } | null;
    if (data && data.type === "humanos:theme") {
      apply(data.theme === "dark" ? "dark" : "light");
    }
  });
}

function apply(theme: "light" | "dark"): void {
  document.body.classList.toggle("dark", theme === "dark");
}

export function isDark(): boolean {
  return document.body.classList.contains("dark");
}
