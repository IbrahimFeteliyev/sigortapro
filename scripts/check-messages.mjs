// Verifies that every locale file has exactly the same message keys as az.json
// (the source locale). Run with: npm run i18n:check
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "messages");
const source = "az";
const targets = ["en", "ru"];

function flatten(value, prefix = "", out = new Map()) {
  if (Array.isArray(value)) {
    out.set(prefix, `array(${value.length})`);
    value.forEach((item, i) => flatten(item, `${prefix}[${i}]`, out));
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out);
    }
  } else {
    out.set(prefix, typeof value);
  }
  return out;
}

const load = (locale) => flatten(JSON.parse(readFileSync(join(root, `${locale}.json`), "utf8")));
const reference = load(source);
let failed = false;

for (const locale of targets) {
  const current = load(locale);
  const missing = [...reference.keys()].filter((k) => !current.has(k));
  const extra = [...current.keys()].filter((k) => !reference.has(k));
  const mismatched = [...reference.keys()].filter(
    (k) => current.has(k) && current.get(k) !== reference.get(k),
  );

  if (missing.length || extra.length || mismatched.length) {
    failed = true;
    console.error(`\n✖ ${locale}.json`);
    missing.forEach((k) => console.error(`  missing:  ${k}`));
    extra.forEach((k) => console.error(`  extra:    ${k}`));
    mismatched.forEach((k) => console.error(`  mismatch: ${k} (${reference.get(k)} vs ${current.get(k)})`));
  } else {
    console.log(`✔ ${locale}.json matches ${source}.json (${reference.size} entries)`);
  }
}

process.exit(failed ? 1 : 0);
