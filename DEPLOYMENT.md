# 🚀 GitHub Pages 部署指南

## ⚡ 快速部署（3分钟）

### 1. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名：`lottery-app`（或其他名称）
3. **Public** 仓库
4. **不要**初始化 README（已有会覆盖）
5. 创建后会显示仓库地址

### 2. 推送代码

```bash
# 在项目根目录执行

# 方法一：使用脚本（推荐）
./build.sh release/github_page

# 方法二：手动操作
git remote add origin https://github.com/YOUR_USERNAME/lottery-app.git
git push -u origin main
git push -u origin release/github_page
```

### 3. 启用 GitHub Pages

1. 进入仓库 → **Settings** → **Pages**
2. **Source** 选择：**GitHub Actions**
3. 等待 2-5 分钟自动部署完成

### 4. 访问网站

```
https://YOUR_USERNAME.github.io/lottery-app/
```

## 📋 详细步骤

### 步骤 1: 准备工作

确保项目已提交到 Git：

```bash
# 检查当前分支
git branch

# 如果在 main 分支，提交最新代码
git add .
git commit -m "feat: 你的更新描述"

# 如果有未提交的更改，先提交
git commit -am "feat: 你的更新描述"
```

### 步骤 2: 构建到部署分支

**使用自动脚本（推荐）：**

```bash
./build.sh release/github_page
```

脚本会自动：
1. 检查或创建 `release/github_page` 分支
2. 配置 vite.config.js 的 base path
3. 运行 `npm run build`
4. 提示后续部署步骤

**手动操作：**

```bash
# 1. 切换到部署分支
git checkout release/github_page

# 2. 合并主分支的最新代码
git merge main

# 3. 检查配置
cat vite.config.js
# 应该看到: base: "/lottery-app/"
```

### 步骤 3: 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `lottery-app`
   - **Description**: 年会抽奖系统 - 支持主题切换和双模式抽奖
   - **Public**: ✅ 公开仓库
   - **不要**勾选 "Add a README file"
3. 点击 **Create repository**

### 步骤 4: 连接本地仓库

```bash
# 添加远程仓库（替换为你的信息）
git remote add origin https://github.com/YOUR_USERNAME/lottery-app.git

# 推送所有分支
git push -u origin main
git push -u origin release/github_page
```

### 步骤 5: 配置 GitHub Pages

1. 进入仓库 → **Settings**
2. 左侧菜单找到 **Pages**
3. **Source** 选择：**GitHub Actions**
4. 点击 **Save**

### 步骤 6: 等待部署

- 进入 **Actions** 标签查看工作流运行
- 等待 🟢 绿色对勾出现
- 2-5分钟后访问网站

## 🔄 更新部署

### 日常更新流程

```bash
# 1. 在 main 分支开发
git checkout main

# 2. 修改代码
# ... 进行修改 ...

# 3. 测试构建
npm run build

# 4. 提交更改
git add .
git commit -m "feat: 新功能描述"

# 5. 部署
./build.sh release/github_page

# 6. 切换到部署分支
git checkout release/github_page

# 7. 推送
git push
```

### 快速命令

如果已经在 `release/github_page` 分支：

```bash
# 拉取最新代码
git pull origin release/github_page

# 或手动合并 main
git merge main
npm run build
git add .
git commit -m "chore: 更新部署"
git push
```

## 🔧 自定义仓库名

如果仓库名不是 `lottery-app`，需要修改配置：

### 1. 修改 vite.config.js

在 `release/github_page` 分支：

```javascript
base: '/YOUR_REPO_NAME/' // 改为你的仓库名
```

### 2. 重新构建

```bash
npm run build
git add .
git commit -m "chore: 更新仓库名"
git push
```

## 🌐 访问地址

部署成功后：

```
https://YOUR_USERNAME.github.io/lottery-app/
```

## ✅ 检查清单

- [ ] GitHub 仓库已创建
- [ ] 本地 Git 已连接到远程
- [ ] main 分支已推送
- [ ] release/github_page 分支已推送
- [ ] vite.config.js 配置正确
-   ```bash
     git checkout release/github_page
     cat vite.config.js
     # 应该看到: base: "/lottery-app/"
     ```
- [ ] GitHub Pages 已启用（Source: GitHub Actions）
- [ ] GitHub Actions 工作流运行成功
- [ ] 可以访问部署的网站

## ❓ 常见问题

### Q: 推送后404错误？
A: 
1. 检查 vite.config.js 的 base 路径
2. 确认仓库名称正确
3. 等待 GitHub Actions 完成

### Q: 样式丢失？
A: 
1. 检查 .nojekyll 文件是否存在
2. 查看浏览器控制台的错误信息

### Q: 路由不工作？
A: 本项目使用 BrowserRouter，已配置 base path

### Q: 如何更新网站？
A:
1. 在 main 分支修改代码
2. 使用 `./build.sh release/github_page` 构建到部署分支
3. 推送 `release/github_page` 分支
4. GitHub Actions 自动部署

### Q: 如何回滚部署？
A:
```bash
git checkout release/github_page
git reset --hard HEAD~1  # 回退一个提交
git push --force
```

## 📊 监控部署状态

- **Actions 标签**：查看工作流运行状态
- **绿色 ✅** = 部署成功
- **红色 ❌** = 部署失败（点击查看日志）

## 🎯 优化建议

1. **更新频率**：建议完成功能后再部署，避免频繁部署
2. **测试充分**：本地测试无误后再推送
3. **版本管理**：使用有意义的提交信息
4. **备份重要数据**：定期导出中奖名单

---

**问题？** 查看 [BRANCHES.md](./BRANCHES.md) 了解分支结构
