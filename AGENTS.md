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
   - **路径必须是真的仓库**：动手前先 `pwd` 确认在 `~/Projects/b2b-website-proto*` 下。历史上发生过在对话目录的仓库副本（`.../dialogues/<日期>/<id>/b2b-website-proto`）里改了一整天还"合并"了，真仓库一个字没动——对话目录里的副本一律只读，不作修改。

4. **预览端口管理**：主目录固定用 `4174`；worktree 演示用独立端口（如 4175+），并在回复里写清楚本次演示的 URL。**删除 worktree 前必须先杀掉它的预览服务**，否则僵尸进程会继续吐出旧快照，用户会以为"合并没生效"：
   ```bash
   lsof -nP -iTCP:<端口> -sTCP:LISTEN   # 找到 PID
   kill <PID>
   ```
   拿不准用户在看哪个页面时，先 `lsof -nP -iTCP -sTCP:LISTEN | grep http.server` 列出所有预览服务及其目录（`lsof -a -p <PID> -d cwd`），确认用户打开的端口指向哪里。

5. **依赖与产物不入库**：`node_modules/`、`dist/` 已忽略；恢复依赖用 `npm ci`，校验与构建用 `npm run check`、`npm run build`。

## “显示 b2b-website-proto 最新版”标准 Workflow

用户只说“显示 b2b-website-proto 最新版”时，“最新版”默认且仅指**主仓 `main` 的最新提交**，不是所有分支中时间最新的提交，也不自动包含未合并的 worktree 改动。唯一来源和入口：

- 仓库：`~/Projects/b2b-website-proto`
- 主页面：`~/Projects/b2b-website-proto/index.html`（Vite 入口）
- 预览：`http://127.0.0.1:4174/`
- 对话目录副本和 `~/Projects/b2b-website-proto-worktrees/` 一律不得作为此请求的展示来源。

必须按顺序执行并验证：

1. **同步并确认版本**：
   ```bash
   cd ~/Projects/b2b-website-proto
   test "$(git rev-parse --show-toplevel)" = "$HOME/Projects/b2b-website-proto"
   git checkout main
   git pull --ff-only origin main
   git status --short --branch
   test -z "$(git status --porcelain -- index.html src public)"
   git log -1 --oneline
   git branch --no-merged main
   ```
   `pull` 失败时必须说明本地 commit 和失败原因，不得把未同步的本地页面称为“最新版”。`index.html`、`src/`、`public/` 必须没有未提交或未跟踪改动；若第二个 `test` 失败，必须报告并请用户选择看 `main` 还是工作区，不得擅自清理、提交或把工作区称为 `main`。其他位置的未提交修改也必须报告。列出未合入 `main` 的分支供用户判断，**不得为了“显示最新版”自动 merge 任务分支**。

2. **核验或启动 `4174`**：
   ```bash
   lsof -nP -iTCP:4174 -sTCP:LISTEN
   ps -p <PID> -o command
   lsof -a -p <PID> -d cwd
   ```
   已有进程必须是从 `~/Projects/b2b-website-proto` 根目录启动的 Vite 服务（同时核对 cwd 和 command）。若端口被其他目录的旧 b2b 预览占用，确认 PID 后 `kill <PID>` 再启动；若是无关服务，不得盲目 kill，必须报告端口冲突。需要启动时：
   ```bash
   cd ~/Projects/b2b-website-proto
   test -d node_modules || npm ci
   nohup npm run dev -- --port 4174 >/tmp/b2b-website-proto-main.log 2>&1 &
   ```

3. **验证 HTTP 内容，而不是只验证端口能打开**：
   ```bash
   TMP=$(mktemp)
   curl -fsS http://127.0.0.1:4174/ -o "$TMP" && \
     grep -q 'id="main-content"' "$TMP" && \
    grep -q '/src/main.js' "$TMP"
   rm -f "$TMP"
   ```
   `curl` 成功且两项 `grep` 均通过才算成功。Vite 会转换开发版 HTML，不能再把响应与原始 `index.html` 直接做 `cmp`。失败时重新检查目录、进程和分支，不得先用“浏览器缓存”搪塞。

4. **展示并报告**：
   ```bash
   cd ~/Projects/b2b-website-proto
   open "http://127.0.0.1:4174/?v=$(git rev-parse --short HEAD)"
   ```
   回复必须写明：仓库路径、`main` 的短 commit、URL、HTTP 内容核验结果，以及未合入 `main` 的分支。只有以上验证全部通过才能说“已显示最新版”。若代码与 HTTP 核验均正确但页面仍旧，再提示硬刷新（Cmd+Shift+R）。

## 仓库结构

主页面：`index.html`；组件位于 `src/components/`，样式位于 `src/styles/`，静态资源位于 `public/assets/`。

本地预览：根目录执行 `npm run dev`（Vite，主目录端口 `4174`）
设计规范与工程结构见 README.md（纯白底 / Inter / 8px 栅格 / orb 是唯一色彩来源）
