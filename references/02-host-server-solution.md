# 02 | 参考答案：理解 Host 与 Server 的关系

## 📋 基础任务参考答案

### todo-server（待办事项 Server）

| 工具名 | 输入 | 输出 |
|--------|------|------|
| `addTodo` | `{ title: string, dueDate?: string }` | `{ id: string, title: string, status: "pending" }` |
| `listTodos` | `{}` | `{ todos: Array<{ id, title, status, dueDate }> }` |
| `deleteTodo` | `{ id: string }` | `{ success: boolean }` |

**设计思路**：待办事项需要持久化存储，可以用内存（演示）或文件/数据库（生产）。

---

### calculator-server（计算器 Server）

| 工具名 | 输入 | 输出 |
|--------|------|------|
| `add` | `{ a: number, b: number }` | `{ result: number }` |
| `subtract` | `{ a: number, b: number }` | `{ result: number }` |
| `multiply` | `{ a: number, b: number }` | `{ result: number }` |
| `divide` | `{ a: number, b: number }` | `{ result: number }` 或 `{ error: string }` |

**设计思路**：纯计算工具，无状态，每次调用独立。适合作为独立的 Server。

---

### search-server（搜索 Server）

| 工具名 | 输入 | 输出 |
|--------|------|------|
| `searchFiles` | `{ query: string, path?: string }` | `{ results: Array<{ file: string, line: string }> }` |
| `searchWeb` | `{ query: string }` | `{ results: Array<{ title: string, url: string, snippet: string }> }` |

**设计思路**：搜索功能可以调用外部服务（grep、find、Google Search API 等），Server 只是封装了这些调用。

---

### Server 之间的依赖关系

**无依赖**。三个 Server 各自独立：
- todo-server 不依赖 calculator-server
- calculator-server 不依赖 search-server
- search-server 不依赖任何其他 Server

这是 MCP 的设计原则之一：**Server 之间不直接通信**，所有交互都通过 Host 的 AI 来协调。

---

## 📋 进阶任务参考答案

```json
{
  "mcpServers": {
    "todo-server": {
      "command": "npx",
      "args": ["tsx", "examples/todo-server.ts"]
    },
    "calculator-server": {
      "command": "npx",
      "args": ["tsx", "examples/calculator-server.ts"]
    },
    "search-server": {
      "command": "npx",
      "args": ["tsx", "examples/search-server.ts"]
    }
  }
}
```

---

## 🔍 思考题答案

**1. 为什么 MCP 选择让 Server 独立运行？**

> 独立运行的好处：
> - **隔离性**：一个 Server 崩溃不会影响其他 Server
> - **可复用**：同一个 Server 可以给不同的 Host 用
> - **可扩展**：新增功能只需要新增 Server，不需要改 Host
> - **语言无关**：Server 可以用任何语言编写，只要遵循 MCP 协议

**2. Client 和 Server 之间的通信是谁发起的？**

> **双向的**：
> - AI（通过 Host）主动发请求给 Server（调用工具）← 最常见
> - Server 也可以主动发通知给 Host（如 long-running 任务完成通知）← 较少用
>
> 关键是：Client 和 Server 之间是**平等的**，不是主从关系。它们通过 JSON-RPC 2.0 规范进行通信。
