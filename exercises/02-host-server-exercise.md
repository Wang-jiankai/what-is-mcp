# 02 | 练习：理解 Host 与 Server 的关系

## 🎯 练习目标

- 理解 MCP 的 Host / Client / Server 三层架构
- 掌握一个 Host 连接多个 Server 的配置方式
- 能够设计自己的多 Server 场景

---

## 📋 练习要求

### 基础任务（必做）

**设计一个"个人助手"场景的 MCP Server 组合：**

你需要为一个个人助手设计 3 个 Server，每个 Server 提供不同功能：

| Server 名称 | 提供的工具 | 工具数量 |
|------------|-----------|---------|
| `todo-server` | 添加待办事项、查看待办列表、删除待办 | 3 个 |
| `calculator-server` | 加法、减法、乘法、除法 | 4 个 |
| `search-server` | 搜索文件、搜索网页 | 2 个 |

**写出每个 Server 的设计思路**（不需要写完整代码）：
- Server 的用途是什么？
- 每个工具的输入和输出是什么？
- Server 之间有没有依赖关系？

### 进阶任务（选做）

**为你的 3 个 Server 编写配置代码**：

在 Claude Desktop 的配置格式下，写出完整的 JSON 配置（不需要实际运行）。

### 思考题

1. **为什么 MCP 选择让 Server 独立运行，而不是把所有功能塞进 Host？**

2. **Client 和 Server 之间的通信是谁发起的？**
   （提示：Host 和 Server 都可以主动发消息）

---

## 💡 提示

- 本练习对应的概念文章：[`concepts/02-host-and-server.md`](../concepts/02-host-and-server.md)
- 参考答案：[`references/02-host-server-solution.md`](../references/02-host-server-solution.md)
