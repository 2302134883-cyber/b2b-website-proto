#!/usr/bin/env bash
# 重建 clone/vendor（@material/web 及 lit 依赖，锁定版本）
set -e
cd "$(dirname "$0")"
TMP=$(mktemp -d)
cd "$TMP"
npm init -y >/dev/null 2>&1
npm install @material/web@2.5.0 esbuild@0.28.2 --no-audit --no-fund
mkdir -p "$OLDPWD/clone/vendor"
for p in lit lit-html lit-element tslib @lit @lit-labs @material; do
  cp -R "node_modules/$p" "$OLDPWD/clone/vendor/"
done
# 打包为经典脚本（IIFE），file:// 直接打开也能加载 Material 组件
./node_modules/.bin/esbuild node_modules/@material/web/all.js \
  --bundle --format=iife --minify \
  --outfile="$OLDPWD/clone/vendor/material-bundle.js"
rm -rf "$TMP"
echo "vendor/ 重建完成（含 material-bundle.js）"
