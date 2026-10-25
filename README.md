# b2b-website-proto

B2B 官网原型页面 · Gemini Neural Expressive 极简风 × Material Web 组件。

## 运行

```bash
# 1. 恢复组件依赖（vendor/ 不入库，按锁定版本重建）
bash setup-vendor.sh

# 2. 起静态服务
cd clone && python3 -m http.server 4174
# 打开 http://127.0.0.1:4174
```

## 设计规范

- 纯白背景 / Inter 字体 / 8px 栅格
- SVG 圆形弥散渐变 orb 是唯一色彩来源（Hero 大 orb + 章节标题节点）
- 阴影极淡或不用；按钮为黑色胶囊；卡片仅 1px 细边
- 禁止大面积渐变铺满、厚重投影、3D、闪烁发光、花哨入场动画

## 结构（按线框图）

导航（下拉+8 语言）→ Hero 三页轮播（B2B数智化 / AI智能体 / 让数据流动）→ WHAT（版本/服务/引导报价）→ WHY（logo/行业/案例）→ 整体架构 → HOW（技术圆盘/AI 智能体）→ 关于我们（视频/地址/安全认证）→ 收尾 CTA → FAQ → 白页脚

## 技术栈

- 单文件 `clone/index.html` + Tailwind CDN
- `@material/web@2.5.0`（菜单/chips/表单/slider/list/fab），`setup-vendor.sh` 用 esbuild 打包为经典脚本 `vendor/material-bundle.js`，file:// 也能加载

## 多语言（i18n）

- 词典驱动：`clone/i18n.js` 内置 8 种语言（zh-CN / en / ja / ko / es / fr / de / ru），导航「🌐 语言」菜单点击即切换，选择存入 localStorage，首次访问按浏览器语言猜测
- 给新文案加翻译：HTML 元素标 `data-i18n="key"`（文本）、`data-i18n-label`（组件 label 属性）、`data-i18n-html`（含标签的富文本）、`data-i18n-aria`（aria-label），然后在 i18n.js 的 8 个词典里各加一条同名 key
