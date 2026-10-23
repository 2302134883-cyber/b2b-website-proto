# AGENTS.md — 多对话并行修改规则（半自动档）

本仓库支持多个 Cindy 对话同时修改。每个对话开工前必须遵守以下规则。

## 核心规则：一对话 = 一任务 = 一 worktree = 一分支

1. **开工前**：如果当前工作目录不是本仓库的 worktree（即不在 `~/Projects/b2b-website-proto-worktrees/` 下），先执行：
   ```bash
   cd ~/Projects/b2b-website-proto
   git worktree add ~/Projects/b2b-website-proto-worktrees/<任务名> -b fix/<任务名>
   ```
   之后所有文件操作都在该 worktree 目录内进行，**绝不直接改主目录 `~/Projects/b2b-website-proto`**。

2. **里程碑提交**：每完成一个小步骤就 commit，message 格式：`[对话标识] 做了什么`。
   回退永远用 `git reset` / `git revert`，不手动改回文件。

3. **收尾合并**：用户说"合并"时：
   ```bash
   cd ~/Projects/b2b-website-proto
   git merge fix/<任务名>
   git worktree remove ~/Projects/b2b-website-proto-worktrees/<任务名>
   git branch -d fix/<任务名>
   git push   # 定期备份到 GitHub
   ```

4. **vendor/** 不入库，重建用 `bash setup-vendor.sh`。

## 仓库结构

主页面：`clone/index.html`（最新 Hero orb⇄X 形变 + 3D 地球 + 客户 logo 无缝轮播）

本地预览：`cd clone && python3 -m http.server 4174`
设计规范见 README.md（纯白底 / Inter / 8px 栅格 / orb 是唯一色彩来源）
