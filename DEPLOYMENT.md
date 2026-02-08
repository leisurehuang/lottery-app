# 🚀 GitHub Pages 部署指南

本项目可以部署到 GitHub Pages，完全免费！

## 📋 前置要求

1. GitHub 账号
2. 本地 Git 环境（或使用 GitHub Desktop）

## 📝 部署步骤

### 方式一：自动部署（推荐）

#### 1. 创建 GitHub 仓库

1. 登录 GitHub
2. 创建新仓库，命名为 `lottery-app`（或其他名称）
3. **重要**：初始化 README
4. 不要添加 .gitignore
5. 创建完成后会显示仓库地址，如：`https://github.com/yourusername/lottery-app`

#### 2. 本地项目推送

```bash
# 在项目根目录执行
cd /Users/lei/Documents/lottery-app

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 首次提交
git commit -m "Initial commit: 年会抽奖系统"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/yourusername/lottery-app.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

#### 3. 配置 GitHub Pages

1. 进入仓库的 **Settings** 页面
2. 左侧菜单找到 **Pages**
3. 在 **Build and deployment** 下：
   - **Source** 选择：GitHub Actions

#### 4. 等待自动部署

推送代码后，GitHub Actions 会自动：
1. 运行构建
2. 部署到 GitHub Pages
3. 几分钟后访问：`https://yourusername.github.io/lottery-app/`

### 方式二：手动部署

#### 1. 构建项目

```bash
npm run build
```

#### 2. 创建 gh-pages 分支

```bash
git checkout -b gh-pages
git add dist
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

#### 3. 配置 GitHub Pages

1. 进入仓库 **Settings** → **Pages**
2. **Source** 选择：Deploy from a branch
3. **Branch** 选择：gh-pages / root
4. 点击 Save

## ⚙️ 配置说明

### vite.config.js
```javascript
base: '/lottery-app/' // 改为你的仓库名
```

如果仓库名不同，需要修改 `base` 配置。

### GitHub Actions 工作流

`.github/workflows/deploy.yml` 会自动：
1. 检测到 `main` 分支的推送
2. 安装依赖并构建
3. 部署到 GitHub Pages

## 🔧 修改仓库名后

如果你的仓库名不是 `lottery-app`，需要修改两处：

### 1. vite.config.js
```javascript
base: '/your-repo-name/' // 改为你的仓库名
```

### 2. 重新构建和推送
```bash
npm run build
git add .
git commit -m "Update base path"
git push
```

## 🌐 访问地址

部署成功后，访问地址为：
```
https://yourusername.github.io/lottery-app/
```

## 🔄 更新网站

每次推送代码到 `main` 分支都会自动重新部署：

```bash
git add .
git commit -m "Update feature"
git push
```

## ❓ 常见问题

### Q: 部署后页面空白？
A: 检查：
1. `vite.config.js` 中的 `base` 路径是否正确
2. 控制台是否有 404 错误
3. GitHub Actions 是否构建成功

### Q: 样式丢失？
A: 确保 `.nojekyll` 文件存在，GitHub Pages 默认会处理下划线开头的文件

### Q: 路由不工作？
A: 本项目使用 BrowserRouter，已配置 base path，应该正常工作

### Q: 如何自定义域名？
A: 
1. 在仓库 **Settings** → **Pages**
2. **Custom domain** 添加你的域名
3. 按照提示配置 DNS

## 📦 部署检查清单

- [ ] 已创建 GitHub 仓库
- [ ] 已配置 `vite.config.js` 的 base 路径
- [ ] 已添加 `.github/workflows/deploy.yml`
- [ ] 已添加 `.nojekyll` 文件
- [ ] 已启用 GitHub Pages（使用 GitHub Actions）
- [ ] 代码已推送到 main 分支
- [ ] GitHub Actions 构建成功
- [ ] 可以访问部署的网站

## 🎉 完成！

部署成功后，你就有了一个永久免费、SSL加密、全球 CDN 加速的抽奖网站！

分享链接：`https://yourusername.github.io/lottery-app/`
