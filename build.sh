#!/bin/bash

# 构建脚本 - 支持构建到不同分支

set -e

BUILD_BRANCH="${1:-release/github_page}"

echo "🔨 构建年会抽奖系统"
echo "=================================="
echo ""
echo "📦 目标分支: $BUILD_BRANCH"
echo ""

# 检查分支是否存在
if ! git rev-parse --verify "$BUILD_BRANCH" >/dev/null 2>&1; then
    echo "⚠️  分支 $BUILD_BRANCH 不存在"
    echo ""
    echo "💡 提示："
    echo "   - release/github_page: GitHub Pages 部署分支"
    echo "   - main: 开发分支"
    echo ""
    read -p "是否创建并切换到 $BUILD_BRANCH 分支? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout -b "$BUILD_BRANCH"
        echo "✅ 已创建并切换到 $BUILD_BRANCH"
    else
        echo "❌ 取消构建"
        exit 1
    fi
else
    echo "✅ 分支 $BUILD_BRANCH 已存在"
    echo ""
fi

# 如果是GitHub Pages分支，确认配置
if [[ "$BUILD_BRANCH" == "release/github_page" ]]; then
    echo "🌐 GitHub Pages 部署模式"
    echo "================================"
    echo ""
    echo "📝 配置检查："
    echo "   - vite.config.js: base path"
    echo "   - GitHub Actions workflow"
    echo "   - .nojekyll 文件"
    echo ""

    # 检查base path配置
    if grep -q "base.*lottery-app" vite.config.js; then
        echo "✅ vite.config.js base path 已配置"
    else
        echo "⚠️  vite.config.js 缺少 base path 配置"
        echo ""
        echo "正在配置 vite.config.js..."
        sed -i.bak '/server:/a\
\
  base: "/lottery-app/",' vite.config.js
        echo "✅ 已添加 base path 配置"
    fi
fi

# 清理旧的构建
echo "🧹 清理旧构建..."
rm -rf dist/

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 构建项目
echo ""
echo "🚀 开始构建..."
npm run build

echo ""
echo "✅ 构建完成！"
echo ""
echo "📦 构建产物: dist/"
echo ""

# 检查构建是否成功
if [ -d "dist" ]; then
    echo "📊 构建统计:"
    echo "   - 文件数: $(find dist -type f | wc -l)"
    echo "   - 大小: $(du -sh dist | cut -f1)"
    echo ""

    if [[ "$BUILD_BRANCH" == "release/github_page" ]]; then
        echo "🌐 GitHub Pages 部署步骤："
        echo ""
        echo "   1. 提交当前分支:"
        echo "      git add ."
        echo "      git commit -m 'chore: 更新构建'"
        echo "      git push"
        echo ""
        echo "   2. 配置 GitHub Pages:"
        echo "      Settings → Pages → Source: GitHub Actions"
        echo ""
        echo "   3. 访问网站:"
        echo "      https://YOUR_USERNAME.github.io/lottery-app/"
        echo ""
    fi
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi
