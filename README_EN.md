# 🔌 What is MCP?

> **"MCP" is the standardized bridge connecting AI to the external world.** This repository is designed for absolute beginners, helping you thoroughly understand what MCP (Model Context Protocol) is through clear concept explanations and runnable code examples.

---

## 📚 Series Repositories

This series contains three repositories to help you master the core concepts of Claude Code:

| Repository | Topic | One-liner |
|------------|-------|-----------|
| 🔗 [what-is-agent](https://github.com/Wang-jiankai/what-is-agent) | **Agent** | AI's "brain" — autonomously plans and executes tasks |
| 🔗 [what-is-skill](https://github.com/Wang-jiankai/what-is-skill) | **Skill** | AI's "toolbox" — modular plugins that extend capabilities |
| 🔗 [what-is-mcp](https://github.com/Wang-jiankai/what-is-mcp) | **MCP** | AI's "interface standard" — a bridge to the external world |

---

## 🔰 What is MCP?

**MCP (Model Context Protocol)** is an open standard protocol for communication between AI models and external data sources, tools, and services.

> **Simple analogy:** If an AI model is a chef, MCP is the standardized interface in the kitchen — no matter the brand of pots, knives, or stoves, as long as they conform to the standard interface, they can be plugged in and used immediately.

### What Problems Does MCP Solve?

| Problem | MCP Solution |
|---------|--------------|
| Each tool requires independent integration | Unified protocol — integrate once, use with all Agents |
| Inconsistent data formats | Standardized JSON-RPC communication |
| High security risks | Sandboxed execution with explicit permission control |
| High maintenance costs | Protocol standardization, community-driven sharing |

### MCP Ecosystem Architecture

```
┌──────────────────────────────────────────────────────┐
│                     AI Model                          │
│                    (Claude, etc.)                    │
└──────────────────────┬───────────────────────────────┘
                       │ JSON-RPC over stdio / HTTP
                       ▼
┌──────────────────────────────────────────────────────┐
│                    MCP Host                           │
│            (Claude Code / Your App)                   │
└──────┬─────────────────┬──────────────────┬─────────┘
       │                 │                  │
       ▼                 ▼                  ▼
┌────────────┐    ┌────────────┐    ┌────────────┐
│ MCP Server │    │ MCP Server │    │ MCP Server │
│  (Filesys) │    │    (DB)    │    │  (Web API) │
└────────────┘    └────────────┘    └────────────┘
```

---

## 💡 Core Concepts

### 1. MCP Host
The application running the AI model, e.g., Claude Code, IDE plugins.

### 2. MCP Server
A lightweight service program providing specific functionality — file operations, database queries, API calls.

### 3. MCP Client
Embedded inside the Host, responsible for communicating with Servers.

### 4. JSON-RPC Protocol
All MCP communication is based on the JSON-RPC 2.0 specification.

### 5. Tool
An executable operation exposed by a Server to the AI.

### 6. Resource
Data or content provided by a Server — files, database records, etc.

---

## 🛠️ TypeScript Code Examples

### Create an MCP Server

```typescript
import { createMCPServer } from "@modelcontextprotocol/sdk";

const server = createMCPServer({
  name: "filesystem-server",
  version: "1.0.0",

  // Define tools
  tools: {
    readFile: {
      description: "Read file contents",
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
      description: "Write content to a file",
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

  // Define resources
  resources: {
    "config://app": {
      description: "Application configuration",
      async load() {
        return { type: "application/json", content: '{"version": "1.0"}' };
      }
    }
  }
});

// Start the server
server.listen(3000);
console.log("MCP Server started, listening on port 3000");
```

### Use MCP in an Agent

```typescript
import { Agent } from "@anthropic-ai/claude-code";
import { connectMCPServer } from "@modelcontextprotocol/sdk";

async function main() {
  // Connect to MCP Server
  const mcpClient = await connectMCPServer({
    transport: "stdio", // or "http://localhost:3000"
    server: "filesystem-server"
  });

  // Create Agent and connect MCP
  const agent = new Agent({
    model: "claude-opus-4-6",
    mcpClients: [mcpClient],
    systemPrompt: "You are a file management assistant. You can read and write files."
  });

  // AI automatically calls MCP tools
  const result = await agent.run(
    "Create a hello.txt file for me with the content 'Hello, MCP!'"
  );

  console.log(result);
}

main();
```

### Full MCP Server Example (with Error Handling)

```typescript
import { createMCPServer } from "@modelcontextprotocol/sdk";

const server = createMCPServer({
  name: "database-server",
  version: "1.0.0",

  tools: {
    query: {
      description: "Execute a database query",
      parameters: {
        sql: { type: "string", required: true }
      },
      async execute({ sql }, context) {
        // Permission check
        if (!context.hasPermission("db:query")) {
          throw new Error("Insufficient permissions: db:query permission required");
        }

        // SQL injection protection (example)
        const dangerousPatterns = /;\s*(DROP|DELETE|TRUNCATE)/i;
        if (dangerousPatterns.test(sql)) {
          throw new Error("Dangerous SQL operations are prohibited");
        }

        // Execute query
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

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or yarn
- TypeScript compiler

### Installation

```bash
# Clone the repository
git clone https://github.com/Wang-jiankai/what-is-mcp.git
cd what-is-mcp

# Install dependencies
npm install
```

### Run Examples

```bash
# Compile TypeScript
npx tsc

# Run MCP Server example
npx ts-node examples/server.ts

# Run client example (in another terminal)
npx ts-node examples/client.ts
```

### Quick Start Built-in MCP Servers

```bash
# Start filesystem server
npx ts-node node_modules/@modelcontextprotocol/sdk/examples/filesystem.ts

# Start HTTP server
npx ts-node node_modules/@modelcontextprotocol/sdk/examples/http.ts
```

---

## 📖 MCP Server Ecosystem

| Server | Purpose | Install Command |
|--------|---------|----------------|
| **filesystem** | Local file read/write | `npm i @modelcontextprotocol/server-filesystem` |
| **postgres** | PostgreSQL database | `npm i @modelcontextprotocol/server-postgres` |
| **slack** | Slack message integration | `npm i @modelcontextprotocol/server-slack` |
| **github** | GitHub API operations | `npm i @modelcontextprotocol/server-github` |
| **sqlite** | SQLite database | `npm i @modelcontextprotocol/server-sqlite` |

---

## 📖 Further Learning

- [MCP Official Documentation](https://modelcontextprotocol.io)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol)
- [MCP Specification (GitHub)](https://github.com/modelcontextprotocol/spec)
- [Anthropic MCP Blog](https://www.anthropic.com/news/model-context-protocol)

---

## 🤝 Contributing

Issues and Pull Requests are welcome! If you've developed a new MCP Server, feel free to share it with the community!

---

## 📄 License

MIT License © 2024 Wang-jiankai
