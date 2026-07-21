#!/usr/bin/env node
/**
 * IW Seed Pack loader — hydrates the IntegrateWise KB with the commercial canon.
 * Usage:  IW_GATEWAY_URL=https://gateway.example IW_TOKEN=xxx node seed.mjs
 * Flags:  DRY_RUN=1 (preview payloads) · ENDPOINT override via IW_KB_ENDPOINT
 * No dependencies. Node 18+.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "articles");
const BASE = process.env.IW_GATEWAY_URL;
const TOKEN = process.env.IW_TOKEN;
const ENDPOINT = process.env.IW_KB_ENDPOINT || "/kb/articles";
const DRY = process.env.DRY_RUN === "1";

if (!DRY && (!BASE || !TOKEN)) {
  console.error("Set IW_GATEWAY_URL and IW_TOKEN (or DRY_RUN=1 to preview).");
  process.exit(1);
}

/** Minimal YAML frontmatter parser (title, visibility: strings; topics, tags: [a, b] lists). */
function parse(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error("missing frontmatter");
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, k, raw] = kv;
    meta[k] = raw.startsWith("[")
      ? raw.replace(/[\[\]]/g, "").split(",").map(s => s.trim()).filter(Boolean)
      : raw.trim();
  }
  return { ...meta, content_md: m[2].trim() };
}

const files = readdirSync(DIR).filter(f => f.endsWith(".md")).sort();
console.log(`Seeding ${files.length} articles ${DRY ? "(DRY RUN)" : `→ ${BASE}${ENDPOINT}`}\n`);

let ok = 0, fail = 0;
for (const f of files) {
  const a = parse(readFileSync(join(DIR, f), "utf8"));
  const payload = {
    title: a.title,
    content_md: a.content_md,
    topics: a.topics || [],
    tags: a.tags || [],
    visibility: a.visibility || "team",
  };
  if (DRY) {
    console.log(`· ${f} → "${payload.title}" [${payload.topics.join(", ")}] (${payload.content_md.length} chars)`);
    ok++;
    continue;
  }
  try {
    const res = await fetch(`${BASE}${ENDPOINT}`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify(payload),
    });
    const body = await res.text();
    if (res.ok) { console.log(`✓ ${payload.title}`); ok++; }
    else { console.error(`✗ ${payload.title} — HTTP ${res.status}: ${body.slice(0, 200)}`); fail++; }
  } catch (e) {
    console.error(`✗ ${payload.title} — ${e.message}`); fail++;
  }
}
console.log(`\nDone: ${ok} ok, ${fail} failed.`);
process.exit(fail ? 1 : 0);
