# 🔌 What is MCP?

> **"MCP" is the standardized bridge connecting AI to the external world.** This repository is designed for absolute beginners, helping you thoroughly understand what MCP (Model Context Protocol) is through clear concept explanations and runnable code examples.

---

> 🌐 **Language**: [中文](./README.md) | [English（当前）](./README_EN.md)

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

### 5. Tools & Resources
Executable operations and readable data exposed by Servers to the AI.

---

## 🛠️ TypeScript Code Examples

### Create an MCP Server

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";

// Create an MCP Server
const server = new McpServer({
  name: "filesystem-server",
  version: "1.0.0"
});

// Register a tool: read file
server.tool(
  "readFile",                          // tool name
  { path: z.string() },                 // parameters (validated with zod)
  async ({ path }) => {                 // implementation
    const fs = await import("fs/promises");
    const content = await fs.readFile(path, "utf-8");
    return { content: [{ type: "text", text: content }] };
  }
);

// Register another tool: write file
server.tool(
  "writeFile",
  { path: z.string(), content: z.string() },
  async ({ path, content }) => {
    const fs = await import("fs/promises");
    await fs.writeFile(path, content, "utf-8");
    return { content: [{ type: "text", text: "File written successfully" }] };
  }
);

// Start server via stdio transport
const transport = new StdioServerTransport();
server.run(transport);
```

> These are **real API** examples. MCP Server uses `new McpServer()` with `.tool()` for tools and `StdioServerTransport` for communication.

### Using MCP in an Agent

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Claude Agent SDK has native MCP support
// Just configure MCP Server in Claude Desktop, and the Agent discovers and calls its tools automatically

for await (const message of query({
  prompt: "Create a hello.txt file with the content 'Hello, MCP!'",
  options: {
    allowedTools: ["Bash", "Write", "Read"]
  }
})) {
  console.log(message);
}
```

> MCP Servers are started by the Host (e.g., Claude Desktop), and the Agent SDK communicates with them via the MCP protocol.

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
npx ts-node examples/01-server.ts

# Run client example (in another terminal)
npx ts-node examples/02-client.ts
```

### Quick Start Built-in MCP Servers

```bash
# Start filesystem server
npx ts-node node_modules/@modelcontextprotocol/sdk/examples/filesystem.ts
```

---

## 📂 Repository Structure

```
what-is-mcp/
├── README.md              # Project overview (Chinese)
├── README_EN.md          # Project overview (English)
├── LICENSE               # MIT License
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
├── .gitignore            # Git ignore rules
│
├── concepts/             # 📚 Core concept articles (read with assets/ for best experience)
│   ├── 01-what-is-mcp.md
│   ├── 02-host-and-server.md
│   ├── 03-json-rpc-protocol.md
│   ├── 04-tools-and-resources.md
│   └── 05-ecosystem.md
│
├── examples/             # 💻 Runnable code examples (each maps to one concept)
│   ├── 01-basic-server.ts          # Maps to concepts/01: MCP basics
│   ├── 02-host-and-server.ts       # Maps to concepts/02: Host & Server relationship
│   ├── 03-protocol-communication.ts # Maps to concepts/03: Protocol communication
│   ├── 04-tools-resources.ts       # Maps to concepts/04: Tools & Resources
│   └── 05-ecosystem-servers.ts     # Maps to concepts/05: Ecosystem servers
│
├── exercises/             # 🏋️ Exercises (one per concepts/ chapter)
│   ├── 01-basic-exercise.md
│   ├── 02-host-server-exercise.md
│   ├── 03-protocol-exercise.md
│   ├── 04-tools-resources-exercise.md
│   └── 05-ecosystem-exercise.md
│
├── references/            # 📝 Exercise reference solutions (check after attempting)
│   ├── 01-basic-solution.ts
│   ├── 02-host-server-solution.ts
│   ├── 03-protocol-solution.ts
│   ├── 04-tools-resources-solution.ts
│   └── 05-ecosystem-solution.ts
│
└── assets/                # 🖼️ Architecture & flow diagrams (referenced by concepts/)
    ├── mcp-architecture.png          # MCP overall architecture (read with concepts/01)
    ├── host-server-flow.png          # Host & Server interaction (read with concepts/02)
    ├── json-rpc-flow.png             # JSON-RPC communication flow (read with concepts/03)
    ├── tools-resources-diagram.png   # Tools & Resources diagram (read with concepts/04)
    └── ecosystem-overview.png        # MCP ecosystem overview (read with concepts/05)
```

### Folder Responsibilities

| Folder | Content | Purpose |
|--------|---------|---------|
| `concepts/` | Theory articles, one per chapter | Build conceptual foundation |
| `examples/` | Runnable code, with concept mapping in header | Learn by doing |
| `exercises/` | Progressive exercises, one per chapter | Reinforce learning |
| `references/` | Reference solutions for exercises | Self-check after attempting |
| `assets/` | Diagrams referenced by `concepts/` articles | Visual aid |

### MCP Server Ecosystem (Official)

| Server | Purpose | Install Command |
|--------|---------|----------------|
| **server-filesystem** | Local file read/write | `npm i @modelcontextprotocol/server-filesystem` |
| **server-postgres** | PostgreSQL database | `npm i @modelcontextprotocol/server-postgres` |
| **server-github** | GitHub API operations | `npm i @modelcontextprotocol/server-github` |
| **server-slack** | Slack message integration | `npm i @modelcontextprotocol/server-slack` |
| **server-sqlite** | SQLite database | `npm i @modelcontextprotocol/server-sqlite` |
| **server-sentry** | Error monitoring | `npm i @modelcontextprotocol/server-sentry` |

### How to Use This Repository

Follow this path through the material:

```
Step 1  →  Read concepts/01 introductory article
           ↓
Step 2  →  Run examples/01 first code sample
           ↓
Step 3  →  Complete exercises/01 corresponding exercise
           ↓
Step 4  →  Check references/01 reference solution (self-review)
           ↓
Step 5  →  Move to next chapter (concepts/02 → examples/02 → ...)

Repeat until all 5 chapters are complete.
```

> **Tip:** Exercise difficulty increases with each chapter. Try to work through exercises independently before consulting `references/`.

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
