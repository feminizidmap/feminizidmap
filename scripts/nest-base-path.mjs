// After `next build`: if SECRET_BASE_PATH is set, move everything in out/ into out/<secret>/.
// next export writes files without the basePath prefix, but static hosts (Vercel serving out/) map URLs
// 1:1 to files, so /<secret>/de must be out/<secret>/de.html. Nothing stays at the root, so "/" is a
// plain 404 that doesn't reveal the secret path.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
nextEnv.loadEnvConfig(root, false);

const secret = (process.env.SECRET_BASE_PATH || "").replace(/^\/+|\/+$/g, "");
if (!secret) process.exit(0);

const out = path.join(root, "out");
const target = path.join(out, secret);
const tmp = path.join(root, `.out-${process.pid}`);

fs.renameSync(out, tmp);
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.renameSync(tmp, target);
console.log(`nest-base-path: out/ moved to out/${secret}/`);
