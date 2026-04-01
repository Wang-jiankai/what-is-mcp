# 05 | MCP 生态与应用

## 🎯 学习目标

- 了解官方 MCP Server 生态
- 掌握如何查找和使用社区贡献的 Server
- 理解 MCP 的未来发展方向

---

## 📖 概念讲解

### 官方 MCP Server 生态

Anthropic 官方维护了一系列 MCP Server：

| Server | 包名 | 用途 |
|--------|------|------|
| filesystem | `@modelcontextprotocol/server-filesystem` | 本地文件读写 |
| github | `@modelcontextprotocol/server-github` | GitHub API 操作 |
| postgres | `@modelcontextprotocol/server-postgres` | PostgreSQL 数据库 |
| sqlite | `@modelcontextprotocol/server-sqlite` | SQLite 数据库 |
| slack | `@modelcontextprotocol/server-slack` | Slack 消息 |
| sentry | `@modelcontextprotocol/server-sentry` | 错误监控 |

### 使用官方 Server

```bash
# 安装
npm install @modelcontextprotocol/server-filesystem

# 在 Claude Desktop 中配置
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]
    }
  }
}
```

### MCP 的优势

1. **一次开发，到处运行**：只要符合 MCP 协议，所有支持的 Host 都能用
2. **生态丰富**：社区贡献了大量 Server，覆盖各个领域
3. **安全可控**：Host 可以控制每个 Server 的权限

---

## 📝 章节回顾

**记住三个关键点：**

1. **官方 Server**：Anthropic 维护了一系列高质量 Server，可直接使用
2. **社区 Server**：社区贡献了大量 Server，质量和安全性需自行评估
3. **MCP 的价值**：标准化带来可复用性和生态繁荣

---

## ❓ 自我检测

- [ ] 能说出 3 个官方 MCP Server 的名称和用途吗？
- [ ] 能自己安装和配置一个官方 Server 吗？

如果全部掌握，恭喜你完成了 what-is-mcp 的全部内容！
