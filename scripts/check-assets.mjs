// Verifies that every file the site references exists in /public.
// Runs automatically before `npm run build`.
import { existsSync, statSync } from "node:fs";
import { DOCS } from "../src/data.js";

const MAX = 25 * 1024 * 1024; // Cloudflare Pages per-file limit (25 MiB)
const need = ["showroom.jpg", "favicon.svg"];
for (const d of DOCS) {
  if (!d.read) continue;
  need.push(d.read.cover, d.read.pdf);
  for (let i = 1; i <= d.read.pages; i++) need.push(`${d.read.dir}p-${String(i).padStart(2, "0")}.jpg`);
}
let missing = 0, big = 0;
for (const f of need) {
  const p = new URL(`../public/${f}`, import.meta.url);
  if (!existsSync(p)) { console.error("  THIẾU:", f); missing++; continue; }
  if (statSync(p).size > MAX) { console.error("  QUÁ 25 MiB (Cloudflare Pages không nhận):", f); big++; }
}
if (missing || big) { console.error(`\n✗ ${missing} file thiếu, ${big} file quá lớn.`); process.exit(1); }
console.log(`✓ Đủ ${need.length} file tài nguyên trong /public.`);
