# 🔌 What is MCP?

> **"MCP" 是 AI 与外部世界连接的标准化桥梁。** 本仓库面向零基础新手，通过清晰的概念讲解与可运行的代码示例，带你彻底理解什么是 MCP（Model Context Protocol）。

---

## 📚 系列仓库

本系列共三个仓库，帮你系统掌握 Claude Code 的核心概念：

| 仓库 | 主题 | 一句话描述 |
|------|------|-----------|
| 🔗 [what-is-agent](https://github.com/Wang-jiankai/what-is-agent) | **Agent** | AI 的"大脑"，能自主规划与执行任务 |
| 🔗 [what-is-skill](https://github.com/Wang-jiankai/what-is-skill) | **Skill** | AI 的"工具箱"，扩展能力的模块化插件 |
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
│                     AI Model                         │
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

### 5. Tool（工具）
Server 向 AI 暴露的可执行操作。

### 6. Resource（资源）
Server 提供的数据或内容，如文件、数据库记录等。

---

## 🛠️ TypeScript 代码示例

### 创建 MCP Server

```typescript
import { createMCPServer } from "@modelcontextprotocol/sdk";

const server = createMCPServer({
  name: "filesystem-server",
  version: "1.0.0",

  // 定义工具
  tools: {
    readFile: {
      description: "读取文件内容",
      parameters: {
        path: { type: "string", required: true }
      },
      async execute({ path }) {
        const fs = await import("fs/promises");
        const content = await fs.readFile(path, "utf-8");
        return { content };
      }
    },

    writeFile: {
      description: "写入文件内容",
      parameters: {
        path: { type: "string", required: true },
        content: { type: "string", required: true }
      },
      async execute({ path, content }) {
        const fs = await import("fs/promises");
        await fs.writeFile(path, content, "utf-8");
        return { success: true };
      }
    }
  },

  // 定义资源
  resources: {
    "config://app": {
      description: "应用程序配置",
      async load() {
        return { type: "application/json", content: '{"version": "1.0"}' };
      }
    }
  }
});

// 启动服务器
server.listen(3000);
console.log("MCP Server 已启动，监听端口 3000");
```

### 在 Agent 中使用 MCP

```typescript
import { Agent } from "@anthropic-ai/claude-code";
import { connectMCPServer } from "@modelcontextprotocol/sdk";

async function main() {
  // 连接 MCP Server
  const mcpClient = await connectMCPServer({
    transport: "stdio", // 或 "http://localhost:3000"
    server: "filesystem-server"
  });

  // 创建 Agent 并连接 MCP
  const agent = new Agent({
    model: "claude-opus-4-6",
    mcpClients: [mcpClient],
    systemPrompt: "你是文件管理助手，可以读取和写入文件。"
  });

  // AI 自动调用 MCP 工具
  const result = await agent.run(
    "帮我创建一个 hello.txt 文件，内容是 'Hello, MCP!'"
  );

  console.log(result);
}

main();
```

### 完整的 MCP Server 示例（带错误处理）

```typescript
import { createMCPServer } from "@modelcontextprotocol/sdk";

const server = createMCPServer({
  name: "database-server",
  version: "1.0.0",

  tools: {
    query: {
      description: "执行数据库查询",
      parameters: {
        sql: { type: "string", required: true }
      },
      async execute({ sql }, context) {
        // 权限检查
        if (!context.hasPermission("db:query")) {
          throw new Error("权限不足：需要 db:query 权限");
        }

        // SQL 注入防护（示例）
        const dangerousPatterns = /;\s*(DROP|DELETE|TRUNCATE)/i;
        if (dangerousPatterns.test(sql)) {
          throw new Error("禁止执行危险 SQL 操作");
        }

        // 执行查询
        const db = await getDatabaseConnection();
        const results = await db.query(sql);
        return { rows: results };
      }
    }
  }
});

server.listen();
```

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
npx ts-node examples/server.ts

# 运行客户端调用示例（在另一个终端）
npx ts-node examples/client.ts
```

### 快速启动内置 MCP Server

```bash
# 启动文件系统服务器
npx ts-node node_modules/@modelcontextprotocol/sdk/examples/filesystem.ts

# 启动 HTTP 服务器
npx ts-node node_modules/@modelcontextprotocol/sdk/examples/http.ts
```

---

## 📖 MCP Server 生态

| Server | 用途 | 安装命令 |
|--------|------|---------|
| **filesystem** | 本地文件读写 | `npm i @modelcontextprotocol/server-filesystem` |
| **postgres** | PostgreSQL 数据库 | `npm i @modelcontextprotocol/server-postgres` |
| **slack** | Slack 消息集成 | `npm i @modelcontextprotocol/server-slack` |
| **github** | GitHub API 操作 | `npm i @modelcontextprotocol/server-github` |
| **sqlite** | SQLite 数据库 | `npm i @modelcontextprotocol/server-sqlite` |

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
