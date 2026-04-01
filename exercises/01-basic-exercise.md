# 01 | 基础练习：构建你的第一个 MCP Server

## 🎯 练习目标

- 理解 MCP Server 的基本结构
- 掌握 Tool 和 Resource 的注册方式
- 能够创建一个带多个工具的 MCP Server

---

## 📋 练习要求

### 基础任务（必做）

1. **创建一个 MCP Server**
   - 名称：`math-server`
   - 版本：`1.0.0`

2. **注册一个乘法工具**
   - 工具名：`multiply`
   - 参数：`a`（number）、`b`（number）
   - 功能：返回 `a * b` 的结果

3. **注册一个除法工具**
   - 工具名：`divide`
   - 参数：`a`（number）、`b`（number）
   - 功能：返回 `a / b` 的结果
   - 额外：处理除以零的情况（返回错误提示）

### 进阶任务（选做）

4. **添加一个静态 Resource**
   - 资源名：`server-info`
   - URI：`calculator://info`
   - 内容：包含 Server 名称、版本、支持的操作列表

5. **添加一个动态 Resource**
   - 资源名：`calculation-history`
   - URI：`calculator://history`
   - 功能：返回最近一次计算的时间和结果（可用内存变量记录）

---

## 🔍 思考题

1. **Tool 和 Resource 的本质区别是什么？**
   （提示：看名字，一个"动"，一个"静"）

2. **为什么 Tool 的参数要用 zod 来定义？**

3. **MCP Server 通过什么方式与 AI 通信？**

---

## 💡 提示

- 本练习对应的概念文章：[`concepts/01-what-is-mcp.md`](../concepts/01-what-is-mcp.md)
- 参考答案：[`references/01-basic-solution.ts`](../references/01-basic-solution.ts)
- 先自己尝试，遇到了困难再看参考答案

---

## ⚠️ 运行说明

MCP Server 不能直接"运行"（它是一个长期运行的服务进程，等待 AI 调用）。

正确的使用方式是：

1. 在 Claude Desktop 的 MCP 配置中添加这个 Server
2. 然后用自然语言让 Claude 调用它的工具

具体配置方法：

```json
// claude_desktop_config.json
{
  "mcpServers": {
    "math-server": {
      "command": "npx",
      "args": ["tsx", "examples/01-basic-server.ts"]
    }
  }
}
```

在 examples 目录下运行时，需要指定正确的路径。
