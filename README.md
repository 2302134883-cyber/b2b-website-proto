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

导航（下拉+8 语言）→ Hero 三页轮播（B2B数智化 / AI智能体 / 让数据流动）→ WHAT（版本/服务/引导报价）→ WHY（logo/行业/案例/背书）→ 关于我们（视频占位+双地图）→ HOW（技术圆盘/AI 智能体/Q&A）→ 白页脚

## 技术栈

- 单文件 `clone/index.html` + Tailwind CDN
- `@material/web@2.5.0`（菜单/chips/表单/slider/list/fab），importmap 引用 `vendor/`
- importmap 注意：裸包名 `@lit/context`、`@lit/reactive-element`、`@lit-labs/ssr-dom-shim` 需精确映射
