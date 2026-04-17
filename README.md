# AI 海龟汤：深渊真相

一个基于 React + Vite + Express 的 AI 海龟汤推理游戏。玩家选择案件后，围绕汤面不断提问，后端调用 AI 模型进行“是 / 否 / 无关”的严格判定。

## 功能概览

- 案件大厅与案件详情页
- AI 判定聊天区
- 前端加载状态、错误提示、重试交互
- 聊天区移动端优化与动画反馈
- 后端请求日志与统一错误处理
- 内置接口文档接口

## 启动方式

### 1. 安装前端依赖

```bash
npm install
```

### 2. 安装后端依赖

```bash
cd server && npm install
```

### 3. 配置环境变量

#### 前端环境变量

复制根目录的 `.env.example` 为 `.env`：

```bash
copy .env.example .env
```

默认内容：

```bash
VITE_API_BASE_URL=http://localhost:3001
```

#### 后端环境变量

复制 `server/.env.example` 为 `server/.env`，并填写真实 key：

```bash
copy server\.env.example server\.env
```

```bash
OPENAI_COMPAT_API_KEY=your_api_key
OPENAI_COMPAT_BASE_URL=https://api.deepseek.com
OPENAI_COMPAT_MODEL=deepseek-chat
PORT=3001
HOST=localhost
```

兼容 `DEEPSEEK_API_KEY` 作为备用变量名。

### 4. 启动后端

```bash
cd server && npm run dev
```

### 5. 启动前端

```bash
npm run dev
```

### 6. 一键同时启动前后端

```bash
npm run dev:all
```

前端默认运行在 `http://localhost:5173`。
后端默认运行在 `http://localhost:3001`。

## 构建与运行检查

### 前端构建

已验证以下命令可成功执行：

```bash
npm run build
```

构建产物输出在根目录 `dist/`，包含：

- `dist/index.html`
- `dist/assets/index-C2Xt10dW.css`
- `dist/assets/index-CWsymJut.js`

### 后端运行

后端已可在 `http://localhost:3001` 正常响应，健康检查接口：

- `GET http://localhost:3001/api/test`

如果启动时报 `EADDRINUSE: address already in use :::3001`，说明本地已有一个后端实例在运行，这通常表示服务已经启动成功，无需重复开启。

## API 接口文档

后端提供了一个可直接访问的接口文档地址：

- `GET /api/docs`

本地启动后可访问：

- `http://localhost:3001/api/docs`

### 主要接口

#### `GET /`
返回服务状态和接口总览。

#### `GET /api/test`
健康检查接口。

#### `GET /api/docs`
返回 JSON 格式的接口文档。

#### `POST /api/chat`
向 AI 判定器提问。

请求体示例：

```json
{
  "question": "这起事件和误会有关吗？",
  "story": {
    "title": "停尸间最后一通电话",
    "surface": "守夜人半夜在停尸间接到一通电话……",
    "bottom": "死者并没有真的打来电话……"
  }
}
```

成功响应示例：

```json
{
  "answer": "是"
}
```

失败响应示例：

```json
{
  "error": {
    "message": "story.bottom 必须是非空字符串。",
    "details": null,
    "requestId": "a1b2c3d4"
  }
}
```

## 前端优化说明

- 发送问题时显示实时加载状态
- 错误卡片支持展示请求编号、附加错误信息与一键重试
- 消息气泡与状态标签增加动态效果
- 推荐问题区域支持移动端横向滑动
- 输入区与消息区在小屏下保持更稳定的阅读和操作体验

## 后端优化说明

- 为每次请求生成 `X-Request-Id`
- 记录请求进入、响应完成、错误异常日志
- 对请求体进行日志脱敏与长度裁剪
- 统一返回结构化错误 JSON
- 通过 `/api/docs` 提供可读接口说明

