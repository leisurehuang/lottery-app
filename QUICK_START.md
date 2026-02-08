# 🌐 GitHub Pages 部署 - 3 分钟快速指南

## ⚡ 快速部署

### 1. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名：`lottery-app`（或自定义）
3. Public 仓库
4. 不要初始化 README

### 2. 推送代码

在项目根目录运行：

```bash
git init
git add .
git commit -m "feat: 年会抽奖系统 - 支持主题切换和双模式抽奖"

# 添加远程仓库（替换为你的用户名）
git remote add origin https://github.com/YOUR_USERNAME/lottery-app.git

git branch -M main
git push -u origin main
```

### 3. 启用 GitHub Pages

1. 进入仓库 → **Settings** → **Pages**
2. **Source** 选择：**GitHub Actions**
3. 保存后自动部署

### 4. 访问网站

```
https://YOUR_USERNAME.github.io/lottery-app/
```

等待 2-5 分钟，GitHub Actions 自动构建并部署！

## ✅ 部署检查清单

- [x] 项目已构建
- [x] vite.config.js 配置 base 路径
- [x] GitHub Actions workflow 已创建
- [x] .nojekyll 文件已添加
- [ ] GitHub 仓库已创建
- [ ] 代码已推送
- [ ] GitHub Pages 已启用

## 🔧 修改仓库名

如果你的仓库名不是 `lottery-app`：

### 修改 vite.config.js

```javascript
base: '/your-repo-name/'
```

### 重新构建和推送

```bash
npm run build
git add .
git commit -m "chore: update base path"
git push
```

## 📊 查看部署状态

进入仓库 → **Actions** 标签，查看部署工作流运行状态。

- ✅ 绿色 ✓ = 部署成功
- ❌ 红色 ✗ = 部署失败，点击查看日志

## 🎉 完成！

部署成功后，你的抽奖系统将拥有：
- 🌐 全球 CDN 加速
- 🔒 免费 SSL 证书（HTTPS）
- 📱 移动端友好
- ♾️ 永久免费托管

---

**问题？** 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 详细文档
