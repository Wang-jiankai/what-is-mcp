# 04 | 工具与资源

## 🎯 学习目标

- 深入理解 Tool（工具）和 Resource（资源）的区别
- 掌握 Tool 的定义方式和参数验证
- 了解 Resource 的 URI 模板机制

---

## 📖 概念讲解

### Tool vs Resource

| 特性 | Tool | Resource |
|------|------|----------|
| **作用** | 执行操作（有副作用） | 提供数据（只读） |
| **调用方式** | AI 主动调用 | AI 主动读取 |
| **返回值** | 操作结果 | 数据内容 |
| **例子** | 发送邮件、写文件 | 读取配置、获取知识库 |
| **MCP 协议方法** | `tools/call` | `resources/read` |

### Tool 的结构

```typescript
server.tool(
  "toolName",           // 1. 工具名称（AI 通过这个名字调用）
  {                     // 2. 参数 schema（zod 验证）
    param1: z.string(),
    param2: z.number()
  },
  async ({ param1, param2 }) => {  // 3. 执行逻辑
    // ... 做点什么
    return {
      content: [{ type: "text", text: "结果" }]
    };
  }
);
```

### Resource 的结构

```typescript
server.resource(
  "resourceName",        // 1. 资源名称
  "protocol://path",    // 2. 资源 URI
  async () => ({         // 3. 数据提供函数
    // 返回资源内容
    key: "value"
  })
);
```

### Resource URI 模板

Resource 支持动态参数：

```typescript
server.resource(
  "user-profile",
  "users://{userId}/profile",  // {userId} 是变量
  async (uri) => {
    const userId = uri.params.userId;  // 提取变量
    return fetchUserProfile(userId);
  }
);
```

---

## 📝 章节回顾

**记住这两个关键区别：**

1. **Tool = 动作**（会改变状态）
2. **Resource = 数据**（只读）

**Resource URI 模板**：`protocol://{param}` 形式，支持动态参数。

---

## ❓ 自我检测

- [ ] 能说出 Tool 和 Resource 的本质区别吗？
- [ ] 能为一个工具写完整的 zod 参数验证吗？

继续学习：[05 - 生态与应用](./05-ecosystem.md)
