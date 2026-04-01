/**
 * 01-basic-solution.ts — 第一章练习参考答案
 *
 * 对应练习：exercises/01-basic-exercise.md
 * 对应概念：concepts/01-what-is-mcp.md
 *
 * 运行方式：
 *   npx tsx examples/01-basic-server.ts
 *
 * 注意：这个 Server 需要在 MCP Host（如 Claude Desktop）中运行。
 * 直接运行这个脚本会启动一个 stdio 服务器，等待 AI 的调用请求。
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";

// ============================================================
// 基础任务 1：创建 MCP Server
// ============================================================
const server = new McpServer({
  name: "math-server",
  version: "1.0.0"
});

// ============================================================
// 基础任务 2 & 3：注册乘法和除法工具
// ============================================================

// 乘法工具
server.tool(
  "multiply",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text" as const, text: `${a} × ${b} = ${a * b}` }]
  })
);

// 除法工具（处理除以零的情况）
server.tool(
  "divide",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => {
    if (b === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: "错误：除数不能为 0"
          }
        ],
        isError: true
      };
    }
    return {
      content: [
        { type: "text" as const, text: `${a} ÷ ${b} = ${a / b}` }
      ]
    };
  }
);

// ============================================================
// 进阶任务 4：静态 Resource
// ============================================================
server.resource(
  "server-info",
  "math://info",
  {
    name: "math-server",
    version: "1.0.0",
    operations: [
      { tool: "multiply", description: "乘法运算", params: ["a: number", "b: number"] },
      { tool: "divide", description: "除法运算", params: ["a: number", "b: number"] }
    ]
  }
);

// ============================================================
// 进阶任务 5：动态 Resource（记录计算历史）
// ============================================================
let lastCalculation: { time: string; expression: string; result: number } | null = null;

server.resource(
  "calculation-history",
  "math://history",
  async () => {
    if (!lastCalculation) {
      return { history: "暂无计算记录" };
    }
    return {
      lastCalculation
    };
  }
);

// ============================================================
// 启动 Server
// ============================================================
const transport = new StdioServerTransport();
server.run(transport);

// ============================================================
// 思考题答案
// ============================================================
/**
 * 1. Tool 和 Resource 的本质区别是什么？
 *    → Tool 是"动作"（会改变状态/有副作用），Resource 是"数据"（只读）。
 *      AI 调用 Tool 会产生结果，读取 Resource 只是获取信息。
 *
 * 2. 为什么 Tool 的参数要用 zod 来定义？
 *    → zod 负责验证参数类型和格式。如果 AI 传了错误的参数类型，
 *      zod 会自动报错，保证工具执行的安全性。
 *
 * 3. MCP Server 通过什么方式与 AI 通信？
 *    → 通过 StdioServerTransport，Server 从 stdin 读取请求，向 stdout 写入响应。
 *      通信协议是 JSON-RPC 2.0。
 */
