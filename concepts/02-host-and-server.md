# 02 | 主机与服务器（Host & Server）

## 🎯 学习目标

- 理解 MCP 的三层架构：Host / Client / Server
- 掌握 Host 和 Server 的职责划分
- 了解一个 Host 可以连接多个 Server

---

## 📖 概念讲解

### MCP 的三层架构

MCP 不是一对一的关系，而是一对多的架构：

```
┌─────────────────────────────────────────────────┐
│                    MCP Host                      │
│         （运行 AI 的应用程序，如 Claude Desktop）  │
│                                                  │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   │
│   │ Client 1 │   │ Client 2 │   │ Client 3 │   │
│   └────┬─────┘   └────┬─────┘   └────┬─────┘   │
└────────┼──────────────┼──────────────┼─────────┘
         │              │              │
         ▼              ▼              ▼
    ┌─────────┐   ┌─────────┐   ┌─────────┐
    │ Server  │   │ Server  │   │ Server  │
    │ (文件系统) │   │ (数据库)  │   │ (GitHub)│
    └─────────┘   └─────────┘   └─────────┘
```

| 组件 | 职责 | 类比 |
|------|------|------|
| **Host** | 运行 AI 的地方，提供用户交互界面 | 操作系统 |
| **Client** | Host 内部的一个模块，负责与一个 Server 通信 | 操作系统里的网卡驱动 |
| **Server** | 提供特定功能的轻量级服务 | U盘、打印机等外设 |

### Host 的职责

- 加载和运行 AI 模型
- 管理多个 MCP Client
- 处理用户交互
- 决定是否允许 AI 调用某个工具

### Server 的职责

- 暴露工具（Tools）和资源（Resources）
- 处理 AI 的调用请求
- 不直接与用户交互，只与 Client 通信

### 一个 Host，多个 Server

这正是 MCP 的强大之处：

```
Claude Desktop（Host）
  ├── Client 1 ── Server：文件系统
  ├── Client 2 ── Server：GitHub API
  ├── Client 3 ── Server：数据库
  └── Client 4 ── Server：Slack
```

AI 可以同时使用所有这些 Server 的能力，但它们各自独立、互不影响。

---

## 💡 生活中的类比

MCP 的 Host/Client/Server 关系，就像**办公室**的工作方式：

- **Host = 办公室**：提供工作环境和工位，供员工（AI）工作
- **Client = 前台/接线员**：每个部门有一个，负责转接和协调
- **Server = 外部服务商**：快递公司、打印店、仓储服务等

员工（AI）不需要知道快递是怎么送的，只需要通过前台（Client）发出请求，服务商（Server）就会完成任务。

---

## 📝 章节回顾

**记住这三个关键点：**

1. **Host 是 AI 运行的环境**，如 Claude Desktop、IDE
2. **Client 在 Host 内部**，每个 Server 对应一个 Client（1:1）
3. **Server 是独立的服务程序**，通过标准协议与 Client 通信

**核心公式：**

```
MCP 架构 = 1 个 Host + N 个 Client + N 个 Server
           （1:N:N 的关系）
```

---

## ❓ 自我检测

- [ ] 能画出 Host / Client / Server 的关系图吗？
- [ ] 能解释为什么一个 Host 可以连接多个 Server 吗？
- [ ] Client 和 Server 是一对一还是一对多？

如果以上问题都能回答，是时候进入下一章了。

---

## 🔗 相关资源

- 配图阅读：[`assets/host-server-flow.png`](../assets/host-server-flow.png)
- 继续学习：[03 - JSON-RPC 协议](./03-json-rpc-protocol.md)
