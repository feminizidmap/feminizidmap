import fs from "node:fs/promises";
import path from "node:path";

// The case snapshot written by scripts/fetch-media.mjs before every build/dev run.
// Server-only (uses fs): import it from server components only. The browser loads the same
// file via loadCases() in api.js.
export async function readCasesSnapshot() {
  const file = path.join(process.cwd(), "public", "data", "cases.json");
  return JSON.parse(await fs.readFile(file, "utf8"));
}
