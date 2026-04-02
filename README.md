# 🔌 What is MCP?

> **"MCP" 是 AI 与外部世界连接的标准化桥梁。** 本仓库通过清晰的概念讲解与可运行的代码示例，帮你彻底理解什么是 MCP（Model Context Protocol）。

---

> 🌐 **Language**: [English](./README_EN.md)

---

## 📚 系列仓库

本系列共三个仓库，帮你系统掌握 Claude Code 的核心概念：

| 仓库 | 主题 | 一句话描述 |
|------|------|-----------|
| 🔗 [what-is-agent](https://github.com/Wang-jiankai/what-is-agent) | **Agent** | AI 的"大脑"，能自主规划与执行任务 |
| 🔗 [what-is-skill](https://github.com/Wang-jiankai/what-is-skill) | **Skill** | AI 的"SOP 手册"，把专家经验结构化打包 |
| 🔗 [what-is-mcp](https://github.com/Wang-jiankai/what-is-mcp) | **MCP** | AI 的"接口标准"，连接外部世界的桥梁 |

---

## 🔰 什么是 MCP？

**MCP（Model Context Protocol，模型上下文协议）** 是一种开放标准协议，用于 AI 模型与外部数据源、工具和服务之间的通信。

> **简单类比：** 如果把 AI 看作一个厨师，MCP 就是厨房里的标准接口——无论是什么品牌的锅、刀、炉子，只要符合标准接口，就能即插即用。

### MCP 解决什么问题？

| 问题 | MCP 解决方案 |
|------|-------------|
| 每个工具需要独立集成 | 统一协议，一次接入，所有 Agent 可用 |
| 数据格式不统一 | 标准化 JSON-RPC 通信格式 |
| 安全风险高 | 沙箱化执行，权限明确控制 |
| 维护成本大 | 协议标准化，社区共建共享 |

### MCP 生态架构

```
┌──────────────────────────────────────────────────────┐
│                     AI Model                          │
│                    (Claude 等)                        │
└──────────────────────┬───────────────────────────────┘
                       │ JSON-RPC over stdio / HTTP
                       ▼
┌──────────────────────────────────────────────────────┐
│                    MCP Host                           │
│            (Claude Code / 你的应用程序)                │
└──────┬─────────────────┬──────────────────┬─────────┘
       │                 │                  │
       ▼                 ▼                  ▼
┌────────────┐    ┌────────────┐    ┌────────────┐
│ MCP Server │    │ MCP Server │    │ MCP Server │
│  (文件系统) │    │  (数据库)   │    │  (Web API)  │
└────────────┘    └────────────┘    └────────────┘
```

---

## 💡 核心概念

### 1. MCP Host（主机）
运行 AI 模型的应用程序，如 Claude Code、IDE 插件等。

### 2. MCP Server（服务器）
提供特定功能的轻量级服务程序，如文件操作、数据库查询、API 调用等。

### 3. MCP Client（客户端）
嵌入在 Host 内部，负责与 Server 通信。

### 4. JSON-RPC 协议
所有 MCP 通信都基于 JSON-RPC 2.0 规范。

### 5. 工具与资源（Tools & Resources）
Server 向 AI 暴露的可执行操作和可读取的数据。

---

## 🛠️ TypeScript 代码示例

### 创建 MCP Server

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";

// 创建 MCP Server
const server = new McpServer({
  name: "filesystem-server",
  version: "1.0.0"
});

// 注册一个工具：读取文件
server.tool(
  "readFile",                          // 工具名称
  { path: z.string() },                // 参数 schema（用 zod 验证）
  async ({ path }) => {                 // 实现
    const fs = await import("fs/promises");
    const content = await fs.readFile(path, "utf-8");
    return { content: [{ type: "text", text: content }] };
  }
);

// 注册另一个工具：写入文件
server.tool(
  "writeFile",
  { path: z.string(), content: z.string() },
  async ({ path, content }) => {
    const fs = await import("fs/promises");
    await fs.writeFile(path, content, "utf-8");
    return { content: [{ type: "text", text: "文件写入成功" }] };
  }
);

// 通过 stdio 传输启动服务器
const transport = new StdioServerTransport();
server.run(transport);
```

> 以上为真实 API。MCP Server 使用 `new McpServer()` 创建，用 `.tool()` 注册工具，通过 `StdioServerTransport` 通信。

### 在 Agent 中使用 MCP

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Claude Agent SDK 原生支持 MCP Server
// 只需在 Claude Desktop 中配置 MCP Server，Agent 即可自动发现并调用其工具
// 无需写额外的连接代码

for await (const message of query({
  prompt: "帮我创建一个 hello.txt 文件，内容是 'Hello, MCP!'",
  options: {
    allowedTools: ["Bash", "Write", "Read"]
  }
})) {
  console.log(message);
}
```

> MCP Server 由 Claude Desktop 等 Host 启动，Agent SDK 通过 MCP 协议与其通信。

---

## 🚀 运行说明

### 前置要求

- Node.js ≥ 18
- npm 或 yarn
- TypeScript 编译器

### 安装

```bash
# 克隆仓库
git clone https://github.com/Wang-jiankai/what-is-mcp.git
cd what-is-mcp

# 安装依赖
npm install
```

### 运行示例

```bash
# 编译 TypeScript
npx tsc

# 运行 MCP Server 示例
npx ts-node examples/01-server.ts

# 运行客户端调用示例（在另一个终端）
npx ts-node examples/02-client.ts
```

### 快速启动内置 MCP Server

```bash
# 启动文件系统服务器
npx ts-node node_modules/@modelcontextprotocol/sdk/examples/filesystem.ts
```

---

## 📂 仓库目录结构

```
what-is-mcp/
├── README.md              # 项目说明（中文）
├── README_EN.md          # 项目说明（英文）
├── LICENSE               # MIT 开源许可证
├── package.json          # 项目依赖配置
├── tsconfig.json         # TypeScript 编译配置
├── .gitignore            # Git 忽略文件
│
├── concepts/             # 📚 核心概念文章（与 assets/ 图片配合阅读效果更佳）
│   ├── 01-what-is-mcp.md
│   ├── 02-host-and-server.md
│   ├── 03-json-rpc-protocol.md
│   ├── 04-tools-and-resources.md
│   └── 05-ecosystem.md
│
├── examples/             # 💻 可运行代码示例（每个文件对应一个核心概念）
│   ├── 01-basic-server.ts          # 对应 concepts/01：MCP 基础概念
│   ├── 02-host-and-server.ts       # 对应 concepts/02：Host 与 Server 关系
│   ├── 03-protocol-communication.ts # 对应 concepts/03：协议通信流程
│   ├── 04-tools-resources.ts       # 对应 concepts/04：工具与资源定义
│   └── 05-ecosystem-servers.ts     # 对应 concepts/05：生态 Server 介绍
│
├── exercises/             # 🏋️ 练习题（每道题对应一篇 concepts/ 文章）
│   ├── 01-basic-exercise.md
│   ├── 02-host-server-exercise.md
│   ├── 03-protocol-exercise.md
│   ├── 04-tools-resources-exercise.md
│   └── 05-ecosystem-exercise.md
│
├── references/            # 📝 练习参考答案（建议先独立完成再对照）
│   ├── 01-basic-solution.ts
│   ├── 02-host-server-solution.ts
│   ├── 03-protocol-solution.ts
│   ├── 04-tools-resources-solution.ts
│   └── 05-ecosystem-solution.ts
│
└── assets/                # 🖼️ 架构图、流程图（供 concepts/ 文章引用）
    ├── mcp-architecture.png          # MCP 整体架构图（配合 concepts/01 阅读）
    ├── host-server-flow.png          # Host 与 Server 交互图（配合 concepts/02 阅读）
    ├── json-rpc-flow.png             # JSON-RPC 通信流程图（配合 concepts/03 阅读）
    ├── tools-resources-diagram.png   # 工具与资源关系图（配合 concepts/04 阅读）
    └── ecosystem-overview.png        # MCP 生态总览图（配合 concepts/05 阅读）
```

### 文件夹职责

| 文件夹 | 内容 | 用途 |
|--------|------|------|
| `concepts/` | 核心理论文章，每篇讲一个知识点 | 帮助新手建立概念框架 |
| `examples/` | 精心设计的可运行代码，顶部标注对应概念 | 边学边实践 |
| `exercises/` | 难度递进的练习（与 concepts/ 章节一一对应）| 巩固学习效果 |
| `references/` | 对应练习的参考解答 | 供对照自查 |
| `assets/` | 架构图、流程图，供 `concepts/` 文章引用 | 辅助理解 |

### MCP Server 生态（官方出品）

| Server | 用途 | 安装命令 |
|--------|------|---------|
| **server-filesystem** | 本地文件读写 | `npm i @modelcontextprotocol/server-filesystem` |
| **server-postgres** | PostgreSQL 数据库 | `npm i @modelcontextprotocol/server-postgres` |
| **server-github** | GitHub API 操作 | `npm i @modelcontextprotocol/server-github` |
| **server-slack** | Slack 消息集成 | `npm i @modelcontextprotocol/server-slack` |
| **server-sqlite** | SQLite 数据库 | `npm i @modelcontextprotocol/server-sqlite` |
| **server-sentry** | 错误监控 | `npm i @modelcontextprotocol/server-sentry` |

### 如何使用本仓库

推荐按以下路径依次学习：

```
第 1 步  →  阅读 concepts/01 入门文章
           ↓
第 2 步  →  运行 examples/01 第一个代码示例
           ↓
第 3 步  →  完成 exercises/01 对应练习
           ↓
第 4 步  →  查阅 references/01 参考答案（自查）
           ↓
第 5 步  →  进入下一章（concepts/02 → examples/02 → ...）

循环往复，直至完成全部 5 章。
```

> **提示：** `exercises/` 的习题难度随章节递增。建议先独立思考，实在卡住再看 `references/`。

---

## 📖 扩展学习

- [MCP 官方文档](https://modelcontextprotocol.io)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol)
- [MCP 规范 (GitHub)](https://github.com/modelcontextprotocol/spec)
- [Anthropic MCP 博客](https://www.anthropic.com/news/model-context-protocol)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！如果你开发了一个新的 MCP Server，欢迎在社区分享！

---

## 📄 许可证

MIT License © 2024 Wang-jiankai
