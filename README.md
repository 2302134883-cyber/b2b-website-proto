# b2b-website-proto

B2B 官网原型页面 · Gemini Neural Expressive 极简风 × Material Web 组件。

## 环境要求

- Node.js `^20.19.0 || >=22.12.0`
- npm（依赖版本由 `package-lock.json` 锁定）

## 本地开发

```bash
npm ci
npm run dev
# 打开 http://127.0.0.1:4174/
```

worktree 演示必须使用独立端口，例如：

```bash
npm run dev -- --port 4176
```

## 校验与生产构建

```bash
npm run check       # 校验八语言词典、静态引用 key 和占位符
npm run build       # 先执行 check，再输出到 dist/
npm run preview     # 预览生产构建，默认 http://127.0.0.1:4175/
```

`node_modules/` 与 `dist/` 不入库。项目已迁移到 Vite 模块加载和构建，不再支持旧的 `file://` 直接打开方式，也不再需要 `setup-vendor.sh` 或 Python 静态服务器。

## 技术栈与工程结构

- Vite + 原生 ES Modules
- Tailwind CSS 构建期生成，不使用 CDN 运行时编译
- `@material/web@2.5.0`，在 `src/components/material.js` 中按需注册组件
- `@fontsource/inter` 自托管字体，不依赖 Google Fonts
- 生产构建按 `material`、`i18n` 和页面主包拆分

```text
index.html                       # 页面语义内容与挂载点
public/assets/                   # 图片、Logo、认证等静态资源
src/
  main.js                        # 样式、字体和组件初始化入口
  components/                    # 导航、Hero、行业、案例、表单等交互模块
  styles/                        # 基础、页眉页脚及各业务组件样式
  i18n/
    index.js                     # 语言应用、浏览器检测和词典合并
    business-modes.js            # 经营模式独立词典
    locales/                     # 八种语言的基础词典
scripts/
  check-i18n.mjs                 # 多语言一致性与静态引用校验
```

新增组件时，保持职责边界：HTML 负责语义内容，组件 JS 负责交互，组件 CSS 负责样式，静态资源放入 `public/assets/`。跨模块协作应优先使用明确的模块接口或事件，避免继续扩大 `window` 全局钩子。

## 设计规范

- 纯白背景 / Inter 字体 / 8px 栅格
- SVG 圆形弥散渐变 orb 是唯一色彩来源（Hero 大 orb + 章节标题节点）
- 阴影极淡或不用；按钮为黑色胶囊；卡片仅 1px 细边
- 禁止大面积渐变铺满、厚重投影、3D、闪烁发光、花哨入场动画

## 页面结构

导航（下拉 + 8 语言）→ Hero 三页轮播（B2B数智化 / AI智能体 / 让数据流动）→ WHAT（经营模式 / 服务 / 报价）→ WHY（行业 / 案例）→ HOW（架构 / 技术 / 数据同源 / AI 智能体）→ 关于我们（视频 / 地址 / 认证）→ FAQ → 收尾 CTA → 页脚。

## 多语言（i18n）

支持 `zh-CN / en / ja / ko / es / fr / de / ru`。导航语言菜单点击即切换，选择存入 localStorage，首次访问按浏览器语言猜测。

给新文案加翻译：

1. 在 HTML 或组件模板中标记：
   - `data-i18n="key"`：纯文本
   - `data-i18n-label="key"`：Material 组件 label
   - `data-i18n-html="key"`：受信任的富文本
   - `data-i18n-aria="key"`：可访问名称
2. 在 `src/i18n/locales/` 的八个语言文件中补齐同名 key；经营模式专用词条放在 `src/i18n/business-modes.js`。
3. 执行 `npm run check`，确保 key、空值和 `{placeholder}` 在八种语言中一致。
