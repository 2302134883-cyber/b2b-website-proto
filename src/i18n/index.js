/* ============ 多语言（i18n） ============
 * 用法：给元素加 data-i18n="key"（文本）/ data-i18n-label（label 属性）
 *       / data-i18n-html（innerHTML）/ data-i18n-aria（aria-label）。
 * 语言菜单（#mm-lang）的 md-menu-item 用 data-lang="语言码" 触发切换。
 * 选择持久化在 localStorage('site-lang')；首次访问按浏览器语言猜测。
 */

import businessModeDicts from './business-modes.js';
import zhCN from './locales/zh-CN.js';
import en from './locales/en.js';
import ja from './locales/ja.js';
import ko from './locales/ko.js';
import es from './locales/es.js';
import fr from './locales/fr.js';
import de from './locales/de.js';
import ru from './locales/ru.js';

(function () {
  const LANGS = ['zh-CN', 'en', 'ja', 'ko', 'es', 'fr', 'de', 'ru'];

  const DICT = {
    'zh-CN': zhCN,
    'en': en,
    'ja': ja,
    'ko': ko,
    'es': es,
    'fr': fr,
    'de': de,
    'ru': ru,
  };

  /* 合并经营模式词典，并覆盖旧版三模式 FAQ。 */
  Object.keys(businessModeDicts).forEach((lang) => {
    if (DICT[lang]) Object.assign(DICT[lang], businessModeDicts[lang]);
  });

  window.__I18N_DICTS = DICT;
  const STORAGE_KEY = 'site-lang';
  let current = 'zh-CN';

  function apply(lang) {
    if (!DICT[lang]) lang = 'zh-CN';
    current = lang;
    const t = DICT[lang];
    document.documentElement.lang = lang;
    if (t['meta.title']) document.title = t['meta.title'];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = t[el.getAttribute('data-i18n')];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const v = t[el.getAttribute('data-i18n-html')];
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-label]').forEach((el) => {
      const v = t[el.getAttribute('data-i18n-label')];
      if (v != null) el.setAttribute('label', v);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const v = t[el.getAttribute('data-i18n-aria')];
      if (v != null) el.setAttribute('aria-label', v);
    });
    window.__i18nApply = apply;
    document.dispatchEvent(new CustomEvent('i18n:applied', { detail: { lang } }));
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* file:// 隐私模式等场景忽略 */ }
  }

  /* 供 canvas 组件（journey.js 等）按当前语言取词条 */
  window.__i18nT = (key) => {
    const lang = document.documentElement.lang || 'zh-CN';
    const t = DICT[lang] || DICT['zh-CN'];
    return t[key] != null ? t[key] : (DICT['zh-CN'][key] != null ? DICT['zh-CN'][key] : undefined);
  };

  function detect() {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved && DICT[saved]) return saved;
    const nav = (navigator.language || '').toLowerCase();
    for (const code of LANGS) {
      if (nav === code.toLowerCase() || nav.startsWith(code.split('-')[0])) return code;
    }
    return 'zh-CN';
  }

  // 语言菜单点击切换
  const menu = document.getElementById('mm-lang');
  if (menu) {
    menu.querySelectorAll('md-menu-item[data-lang]').forEach((item) => {
      item.addEventListener('click', () => {
        apply(item.getAttribute('data-lang'));
        menu.open = false;
      });
    });
  }

  apply(detect());
})();
