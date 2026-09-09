/** Public-asset URL that works on `/` and on GitHub Pages `/a129-atelier/`. */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const clean = path.replace(/^\//, "");
  return `${base}${clean}`;
}
