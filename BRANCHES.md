# 📁 项目分支说明

本项目使用分支管理，将源代码和部署配置分离。

## 🌿 分支结构

### `main` 分支（主分支）
- **用途**: 开发分支，包含纯源代码
- **内容**:
  - `src/` - 源代码
  - `public/` - 静态资源
  - `package.json` - 项目配置
  - `vite.config.js` - 开发配置（无 base path）
  - `README.md` - 功能说明
  - `build.sh` - 智能构建脚本
  - `screenshots/` - 界面截图

**特点**: 干净的源代码，无部署配置

### `release/github_page` 分支（部署分支）
- **用途**: GitHub Pages 部署分支
- **内容**: 包含主分支的所有内容 + 部署配置
- **额外配置**:
  - `vite.config.js` - 添加 `base: '/lottery-app/'`
  - `.github/workflows/deploy.yml` - 自动部署workflow
  - `.nojekyll` - 防止文件被忽略
  - `.gitignore` - Git忽略规则
  - `DEPLOYMENT.md` - 详细部署文档
  - `QUICK_START.md` - 快速部署指南
  - `deploy.sh` - 部署辅助脚本

## 🔄 工作流程

### 日常开发

```bash
# 1. 在 main 分支开发
git checkout main

# 2. 修改代码、测试
npm run dev

# 3. 提交代码
git add .
git commit -m "feat: 新功能"

# 4. 推送到远程（如果需要）
git push
```

### 部署到 GitHub Pages

#### 方式一：使用构建脚本（推荐）

```bash
# 构建到 release/github_page 分支
./build.sh release/github_page

# 切换到部署分支
git checkout release/github_page

# 推送部署分支
git push origin release/github_page
```

#### 方式二：手动构建

```bash
# 1. 切换到部署分支
git checkout release/github_page

# 2. 合并 main 分支的更改
git merge main

# 3. 构建项目
npm run build

# 4. 提交并推送
git add .
git commit -m "chore: 更新部署版本"
git push origin release/github_page
```

## 📊 分支对比

| 特性 | main | release/github_page |
|------|------|-------------------|
| vite.config.js base | 无 | `/lottery-app/` |
| GitHub Actions | 无 | ✅ |
| .nojekyll | 无 | ✅ |
| 部署文档 | 无 | ✅ |
| 源代码 | ✅� | ✅ |

## 🚀 部署步骤

### 首次部署

```bash
# 1. 推送两个分支
git push -u origin main
git push -u origin release/github_page

# 2. 在 GitHub 启用 Pages
# Settings → Pages → Source: GitHub Actions
```

### 更新部署

```bash
# 方式一：使用构建脚本（推荐）
./build.sh release/github_page
git checkout release/github_page
git push

# 方式二：手动合并
git checkout release/github_page
git merge main
npm run build
git add .
git commit -m "chore: 更新部署"
git push
```

## 💡 好处

1. **源码分离**：主分支保持干净，只包含源代码
2. **独立配置**：部署配置独立在专门分支
3. **灵活部署**：可以支持多种部署方式
4. **易于维护**：开发和部署流程清晰分离

## 🔧 工具脚本

- `build.sh` - 智能构建脚本，支持构建到不同分支
- `deploy.sh` - 部署辅助脚本（在部署分支）

## 📝 注意事项

1. **main 分支**: 
   - 保持纯净的源代码
   - 不要添加部署相关配置

2. **release/github_page 分支**:
   - 总是包含最新的 main 分支代码
   - 包含所有部署配置
   - 用于推送到 GitHub

3. **更新流程**:
   - 在 main 分支开发和测试
   - 完成后合并到 release/github_page 分支
   - 从 release/github_page 分支推送部署

---

**建议**: 日常开发在 main 分支，需要部署时再合并到 release/github_page 分支
