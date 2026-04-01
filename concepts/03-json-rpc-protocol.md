# 03 | JSON-RPC 协议

## 🎯 学习目标

- 理解 JSON-RPC 2.0 的基本概念
- 掌握 MCP 请求和响应的格式
- 了解 MCP 的两种传输方式：stdio 和 HTTP

---

## 📖 概念讲解

### JSON-RPC 是什么？

**JSON-RPC** 是一种轻量级的远程过程调用（RPC）协议，使用 JSON 作为数据格式。

特点：
- **简单**：只有几种消息类型
- **无状态**：每个请求独立处理
- **双向**：可以发起请求，也可以接收通知

### MCP 的通信流程

```
Host（AI 应用）                          Server
      │                                     │
      │────── JSON-RPC Request ──────────▶│
      │         (tool call)                │
      │                                     │
      │◀───────── JSON-RPC Response ──────│
      │         (result or error)           │
```

### 两种传输方式

| 传输方式 | 适用场景 | 原理 |
|---------|---------|------|
| **stdio** | 本地 Server（Claude Desktop） | 通过标准输入/输出通信 |
| **Streamable HTTP** | 远程 Server | 通过 HTTP 请求/响应通信 |

---

## 📝 章节回顾

**记住这三个关键点：**

1. **MCP 基于 JSON-RPC 2.0**：所有消息都是 JSON 格式的请求/响应
2. **stdio 用于本地**：Server 作为子进程，通过 stdin/stdout 与 Host 通信
3. **HTTP 用于远程**：Server 部署在远程，通过 REST API 通信

---

## ❓ 自我检测

- [ ] 能写出 JSON-RPC 请求和响应的格式吗？
- [ ] 能区分 stdio 和 HTTP 两种传输方式吗？

继续学习：[04 - 工具与资源](./04-tools-and-resources.md)
