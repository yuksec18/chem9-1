# 🧪 化学小课堂

沪教版九年级上册化学互动学习小程序，基于 Claude AI 驱动，适合初中生使用。

## 功能

- 📚 **章节导览** — 点击章节，AI 实时讲解重点知识
- 💬 **自由提问** — 随时向 AI 提任何化学问题
- ✏️ **随堂测验** — 8 道精选题目，即时反馈
- 🃏 **记忆卡片** — 化学式、定律速记卡片
- 🔬 **实验步骤** — 必考实验详细步骤
- ⚗️ **化学式速查** — 常见物质和方程式参考表

## 部署到 Vercel（3步完成）

### 第一步：上传代码到 GitHub

1. 前往 [github.com](https://github.com) 新建仓库（比如叫 `chem-app`）
2. 将本项目所有文件上传到仓库

   最简单的方式：点击仓库页面的 "uploading an existing file"，把整个文件夹拖进去

### 第二步：连接 Vercel

1. 前往 [vercel.com](https://vercel.com)，用 GitHub 账号登录（免费）
2. 点击 **"Add New Project"**
3. 选择刚才创建的 `chem-app` 仓库
4. 直接点击 **"Deploy"**（无需修改任何配置）
5. 等待约 1 分钟，部署完成！

### 第三步：获取 API Key

1. 前往 [console.anthropic.com](https://console.anthropic.com) 注册（免费）
2. 在 "API Keys" 页面创建一个 Key（格式：`sk-ant-api03-...`）
3. 打开部署好的网址，首次访问会弹出输入框，粘贴 Key 即可

## 项目结构

```
chem-app/
├── public/
│   └── index.html      # 完整前端页面
├── api/
│   └── chat.js         # Vercel Edge Function（转发 AI 请求）
├── vercel.json         # Vercel 路由配置
└── package.json
```

## 费用说明

- Vercel 托管：**完全免费**（每月 100GB 流量）
- Anthropic API：按用量计费，普通学习用量约 **每月 1-5 元人民币**

## 隐私说明

API Key 仅保存在用户本地浏览器（localStorage），不会传输到除 Anthropic 以外的任何服务器。
