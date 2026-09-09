# 子言的学习屋

考研备考 · 百日冲刺 - 华工安全工程

## 部署到 GitHub Pages 教程

### 方法一：网页上传（最简单，推荐新手）

**第一步：创建 GitHub 账号**
- 打开 https://github.com
- 注册一个账号（免费的）

**第二步：创建新仓库**
1. 登录后，点右上角 `+` → `New repository`
2. Repository name 填：`ziyan-study-room`（或你喜欢的名字）
3. 选择 `Public`（公开，免费）
4. 勾选 `Add a README file`
5. 点 `Create repository`

**第三步：上传文件**
1. 进入你刚创建的仓库
2. 点 `Add file` → `Upload files`
3. 把这个文件夹里的所有文件拖进去（index.html, manifest.json, assets 文件夹, _shared 文件夹）
4. 拉到最下面，点 `Commit changes`

**第四步：开启 GitHub Pages**
1. 在仓库页面，点 `Settings`（设置）
2. 左边菜单找到 `Pages`
3. Branch 那里选 `main`（或 `master`），文件夹选 `/ (root)`
4. 点 `Save`
5. 等 1-2 分钟，页面上方会出现你的网址，类似：`https://你的用户名.github.io/ziyan-study-room/`

**第五步：打开使用**
- 用手机或电脑浏览器打开上面的网址
- iPhone: Safari 打开 → 分享 → 添加到主屏幕
- Android: Chrome 打开 → 右上 ⋮ → 安装应用
- 电脑: Chrome/Edge 地址栏右边有安装按钮

---

### 方法二：Git 命令行（适合会用 git 的）

```bash
# 1. 初始化
git init
git add .
git commit -m "初始提交"

# 2. 关联远程仓库（替换成你自己的仓库地址）
git remote add origin https://github.com/你的用户名/ziyan-study-room.git
git branch -M main
git push -u origin main

# 3. 去 GitHub 仓库 Settings → Pages 开启 Pages
```

---

## 数据说明

- 所有学习数据存在你本地浏览器的 localStorage 里
- 换设备/换浏览器数据不会同步
- 定期用「数据管理」→「导出数据文件」备份
- 换新设备后用「导入数据」恢复

---

## 更新内容

如果以后想更新功能，重新上传新的 `index.html` 覆盖就行，数据不会丢。
