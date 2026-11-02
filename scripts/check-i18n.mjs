import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import businessModeDicts from '../src/i18n/business-modes.js';
import techCapabilityDicts from '../src/i18n/tech-capabilities.js';
import aboutCompanyDicts from '../src/i18n/about-company.js';
import techSectionDicts from '../src/i18n/tech-section.js';
import zhCN from '../src/i18n/locales/zh-CN.js';
import en from '../src/i18n/locales/en.js';
import ja from '../src/i18n/locales/ja.js';
import ko from '../src/i18n/locales/ko.js';
import es from '../src/i18n/locales/es.js';
import fr from '../src/i18n/locales/fr.js';
import de from '../src/i18n/locales/de.js';
import ru from '../src/i18n/locales/ru.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseDicts = { 'zh-CN': zhCN, en, ja, ko, es, fr, de, ru };
const languages = Object.keys(baseDicts);
const dictionaries = Object.fromEntries(
  languages.map((lang) => [lang, {
    ...baseDicts[lang],
    ...businessModeDicts[lang],
    ...techCapabilityDicts[lang],
    ...aboutCompanyDicts[lang],
    ...(techSectionDicts[lang] || {}),
  }]),
);

/* 必须逐条完整的语言。其余语言允许缺词 —— 运行时在 src/i18n/index.js 回退到 en。
 * 目前 Technology 栏目（tech-section.js）只维护 zh-CN 与 en。 */
const STRICT_LANGS = ['zh-CN', 'en'];

const errors = [];
const warnings = [];
const referenceKeys = Object.keys(dictionaries['zh-CN']).sort();

for (const lang of languages) {
  const dictionary = dictionaries[lang];
  const keys = Object.keys(dictionary);
  const strict = STRICT_LANGS.includes(lang);
  const missing = referenceKeys.filter((key) => !(key in dictionary));
  const extra = keys.filter((key) => !(key in dictionaries['zh-CN']));
  if (missing.length) {
    const message = `${lang}: missing ${missing.length} keys: ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? ' …' : ''}`;
    if (strict) errors.push(message);
    else warnings.push(`${message} (falls back to en)`);
  }
  if (extra.length) errors.push(`${lang}: extra keys: ${extra.join(', ')}`);
  for (const [key, value] of Object.entries(dictionary)) {
    if (typeof value !== 'string' || !value.trim()) errors.push(`${lang}:${key} must be a non-empty string`);
  }
}

function collectSourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(target);
    return /\.(?:html|js)$/.test(entry.name) ? [target] : [];
  });
}

const pagesDir = path.join(root, 'tech');
const techPages = fs.existsSync(pagesDir)
  ? fs.readdirSync(pagesDir).filter((name) => name.endsWith('.html')).map((name) => path.join(pagesDir, name))
  : [];

const sourceFiles = [
  path.join(root, 'index.html'),
  ...techPages,
  ...collectSourceFiles(path.join(root, 'src')),
];
const usedKeys = new Set();
const attributePattern = /data-i18n(?:-html|-label|-aria)?\s*=\s*["'`]([a-z0-9._-]+)["'\`]/gi;
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(attributePattern)) {
    // "key" is the placeholder used in the i18n usage comment, not a real dictionary key.
    if (match[1] !== 'key') usedKeys.add(match[1]);
  }
}
for (const lang of languages) {
  const missing = [...usedKeys].filter((key) => !(key in dictionaries[lang]));
  if (!missing.length) continue;
  const message = `${lang}: keys used but not translated: ${missing.join(', ')}`;
  if (STRICT_LANGS.includes(lang)) errors.push(message);
  else warnings.push(`${message} (falls back to en)`);
}

const placeholders = (value) => [...value.matchAll(/\{([^{}]+)\}/g)].map((match) => match[1]).sort();
for (const key of referenceKeys) {
  const expected = placeholders(dictionaries['zh-CN'][key]);
  for (const lang of STRICT_LANGS) {
    const actual = placeholders(dictionaries[lang][key] ?? '');
    if (expected.join('|') !== actual.join('|')) {
      errors.push(`${lang}:${key} placeholders differ: expected ${expected}, got ${actual}`);
    }
  }
}

if (warnings.length) {
  console.warn(`i18n fallback notes (non-blocking):\n  ${warnings.join('\n  ')}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `i18n OK: ${languages.length} languages, ${referenceKeys.length} dictionary keys, ${usedKeys.size} statically used keys (strict: ${STRICT_LANGS.join(', ')}).`,
);
