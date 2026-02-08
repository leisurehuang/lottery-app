#!/bin/bash

# GitHub Pages 快速部署脚本

echo "🚀 年会抽奖系统 - GitHub Pages 部署助手"
echo "================================"
echo ""

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查是否已初始化 Git
if [ ! -d ".git" ]; then
    echo "📝 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit: 年会抽奖系统"
    echo ""
    echo "✅ Git 仓库初始化完成"
    echo ""
    echo "📌 下一步："
    echo "1. 在 GitHub 创建新仓库: https://github.com/new"
    echo "2. 仓库名建议: lottery-app"
    echo "3. 运行以下命令（替换为你的仓库地址）:"
    echo ""
    echo "   git remote add origin https://github.com/YOUR_USERNAME/lottery-app.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "4. 在 GitHub 仓库设置中启用 Pages:"
    echo "   Settings → Pages → Source: GitHub Actions"
    echo ""
else
    echo "✅ Git 仓库已初始化"
    echo ""
    echo "📌 部署或更新到 GitHub Pages:"
    echo ""
    echo "   git add ."
    echo "   git commit -m 'Update: 提交信息'"
    echo "   git push"
    echo ""
fi

echo "💡 提示："
echo "   - 首次部署需要等待 5-10 分钟"
echo "   - 查看部署状态：仓库 → Actions 标签"
echo "   - 详细文档：查看 DEPLOYMENT.md"
echo ""
echo "🎯 部署成功后访问："
echo "   https://YOUR_USERNAME.github.io/lottery-app/"
echo ""
