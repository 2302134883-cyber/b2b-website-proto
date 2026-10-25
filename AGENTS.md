# AGENTS.md — 多对话并行修改规则（半自动档）

本仓库支持多个 Cindy 对话同时修改。每个对话开工前必须遵守以下规则。

## 核心规则：一对话 = 一任务 = 一 worktree = 一分支

1. **开工前**：如果当前工作目录不是本仓库的 worktree（即不在 `~/Projects/b2b-website-proto-worktrees/` 下），先执行：
   ```bash
   cd ~/Projects/b2b-website-proto
   git checkout main && git pull          # 保证基于最新 main
   git worktree add ~/Projects/b2b-website-proto-worktrees/<任务名> -b fix/<任务名> main
   ```
   **必须显式从 `main` 拉分支**（不写第三个参数会基于主目录当前检出的任何分支，可能带上未合并的半成品）。
   之后所有文件操作都在该 worktree 目录内进行，**绝不直接改主目录 `~/Projects/b2b-website-proto`，绝不在主目录里 `git checkout -b` 或 commit**。

2. **里程碑提交**：每完成一个小步骤就 commit，message 格式：`[对话标识] 做了什么`。
   回退永远用 `git reset` / `git revert`，不手动改回文件。

3. **收尾合并**：用户说"合并"时，严格按顺序执行，**每步都要验证**：
   ```bash
   cd ~/Projects/b2b-website-proto
   git checkout main                      # 必须！不切到 main 会合并到错误的分支
   git merge fix/<任务名>
   git log --oneline -3                   # 验证：能看到该任务的 commit 才算成功
   git push origin main                   # 显式推 main，不裸跑 git push
   git worktree remove ~/Projects/b2b-website-proto-worktrees/<任务名>
   git branch -d fix/<任务名>
   git worktree list && git branch        # 验证：worktree 和分支都已消失，主目录停在 main
   ```
   常见翻车自查：
   - merge 输出 `Already up to date` 但任务分支明明有新 commit → 检查是不是合到了错误的分支（`git branch --show-current` 必须是 `main`）。
   - 任务改动是在主目录直接 commit 的（违反第 1 条）→ 先 `git checkout main && git merge <那个分支>` 补救，再把主目录切回 main。
   - 合并后用户说页面上看不到效果 → 确认 `git log main` 里有该 commit、`origin/main` 已推送，并提醒用户硬刷新浏览器（Cmd+Shift+R）排除缓存。

4. **预览端口管理**：主目录固定用 `4174`；worktree 演示用独立端口（如 4175+），并在回复里写清楚本次演示的 URL。**删除 worktree 前必须先杀掉它的预览服务**，否则僵尸进程会继续吐出旧快照，用户会以为"合并没生效"：
   ```bash
   lsof -nP -iTCP:<端口> -sTCP:LISTEN   # 找到 PID
   kill <PID>
   ```
   拿不准用户在看哪个页面时，先 `lsof -nP -iTCP -sTCP:LISTEN | grep http.server` 列出所有预览服务及其目录（`lsof -a -p <PID> -d cwd`），确认用户打开的端口指向哪里。

5. **vendor/** 不入库，重建用 `bash setup-vendor.sh`。

## 仓库结构

主页面：`clone/index.html`（最新 Hero orb⇄X 形变 + 3D 地球 + 客户 logo 无缝轮播）

本地预览：`cd clone && python3 -m http.server 4174`
设计规范见 README.md（纯白底 / Inter / 8px 栅格 / orb 是唯一色彩来源）
