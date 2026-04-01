/**
 * 01-basic-server.ts — MCP 基础示例
 *
 * 本章知识点：concepts/01 - 什么是 MCP？
 *
 * 本示例展示一个最简单的 MCP Server，具备两个核心要素：
 *   - Tool（工具）：AI 可以主动调用的函数
 *   - Resource（资源）：AI 可以读取的数据
 *
 * 本文件是一个完整的 MCP Server，运行后会通过 stdio 接收 AI 的调用请求。
 *
 * 运行方式：
 *   npm install
 *   npx tsx examples/01-basic-server.ts
 *
 * 注意：这个 Server 需要在 Claude Desktop 等 MCP Host 中运行才能被 AI 使用。
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";

// ============================================================
// 步骤 1：创建 MCP Server
// ============================================================
const server = new McpServer({
  name: "calculator-server",    // Server 名称
  version: "1.0.0"             // 版本号
});

// ============================================================
// 步骤 2：注册 Tool（工具）—— AI 可以主动调用
// ============================================================
// Tool 的三个要素：
//   1. name        ：工具名称，AI 通过这个名字调用它
//   2. inputSchema ：参数定义，用 zod 验证参数类型
//   3. handler     ：实际执行逻辑，返回结果

// Tool 1：加法
server.tool(
  "add",                         // 工具名称
  {                              // 参数 schema（zod 验证）
    a: z.number(),
    b: z.number()
  },
  async ({ a, b }) => {          // 执行逻辑
    return {
      content: [
        {
          type: "text" as const,
          text: `${a} + ${b} = ${a + b}`
        }
      ]
    };
  }
);

// Tool 2：减法
server.tool(
  "subtract",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text" as const, text: `${a} - ${b} = ${a - b}` }]
  })
);

// Tool 3：乘法
server.tool(
  "multiply",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text" as const, text: `${a} × ${b} = ${a * b}` }]
  })
);

// Tool 4：除法（处理除以零）
server.tool(
  "divide",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => {
    if (b === 0) {
      return {
        content: [{ type: "text" as const, text: "错误：除数不能为 0" }],
        isError: true
      };
    }
    return {
      content: [{ type: "text" as const, text: `${a} ÷ ${b} = ${a / b}` }]
    };
  }
);

// ============================================================
// 步骤 3：注册 Resource（资源）—— AI 可以读取（只读）
// ============================================================
// Resource 的特点：
//   - AI 可以主动读取资源内容
//   - Resource 是只读的，不会产生副作用
//   - 适合提供配置信息、知识库等静态或动态数据

// 方式一：静态资源（固定内容）
server.resource(
  "app-info",                    // 资源名称
  "calculator://app-info",       // 资源 URI
  {
    info: "Calculator Server v1.0.0，支持加减法和BMI计算。",
    version: "1.0.0",
    author: "MCP Tutorial"
  }
);

// 方式二：动态资源（通过函数生成内容）
server.resource(
  "health-check",
  "calculator://health",
  async () => ({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
);

// ============================================================
// 步骤 4：启动 Server
// ============================================================
// 使用 StdioServerTransport：
//   - stdin 接收来自 Host 的请求
//   - stdout 发送响应给 Host
//   - 适合本地运行的 MCP Server
const transport = new StdioServerTransport();
server.run(transport);
