/**
 * 02-host-and-server.ts — Host 与 Server 关系演示
 *
 * 本章知识点：concepts/02 - 主机与服务器（Host & Server）
 *
 * 本示例展示：
 *   - 一个 Host（Claude Desktop）可以同时连接多个 Server
 *   - 每个 Server 提供不同领域的工具
 *   - Server 之间相互独立，互不影响
 *
 * 注意：本文件是"演示配置"，展示 Host 如何连接多个 Server。
 * 实际运行时需要分别在不同的进程中启动各个 Server。
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";

// ============================================================
// Server 1：文件系统 Server
// ============================================================
function createFileServer() {
  const server = new McpServer({ name: "file-server", version: "1.0.0" });

  server.tool(
    "readFile",
    { path: z.string() },
    async ({ path }) => {
      const fs = await import("fs/promises");
      const content = await fs.readFile(path, "utf-8");
      return { content: [{ type: "text" as const, text: content }] };
    }
  );

  server.tool(
    "writeFile",
    { path: z.string(), content: z.string() },
    async ({ path, content }) => {
      const fs = await import("fs/promises");
      await fs.writeFile(path, content, "utf-8");
      return { content: [{ type: "text" as const, text: "文件写入成功" }] };
    }
  );

  return server;
}

// ============================================================
// Server 2：天气 Server
// ============================================================
function createWeatherServer() {
  const server = new McpServer({ name: "weather-server", version: "1.0.0" });

  server.tool(
    "getWeather",
    { city: z.string() },
    async ({ city }) => {
      // 模拟天气数据（真实场景会调用外部 API）
      const weatherData: Record<string, string> = {
        北京: "晴天，25°C",
        上海: "多云，28°C",
        广州: "雨天，30°C"
      };
      const weather = weatherData[city] ?? "未知城市";
      return { content: [{ type: "text" as const, text: `${city}：${weather}` }] };
    }
  );

  return server;
}

// ============================================================
// Server 3：提醒 Server
// ============================================================
function createReminderServer() {
  const server = new McpServer({ name: "reminder-server", version: "1.0.0" });

  server.tool(
    "setReminder",
    { message: z.string(), time: z.string() },
    async ({ message, time }) => ({
      content: [
        {
          type: "text" as const,
          text: `已设置提醒："${message}"，时间：${time}`
        }
      ]
    })
  );

  return server;
}

// ============================================================
// Host 配置示例（Claude Desktop 的配置）
// ============================================================
/**
 * 在 Claude Desktop 中，你可以同时配置多个 MCP Server：
 *
 * {
 *   "mcpServers": {
 *     "file-server": {
 *       "command": "node",
 *       "args": ["/path/to/examples/02-host-and-server.ts", "file"]
 *     },
 *     "weather-server": {
 *       "command": "node",
 *       "args": ["/path/to/examples/02-host-and-server.ts", "weather"]
 *     },
 *     "reminder-server": {
 *       "command": "node",
 *       "args": ["/path/to/examples/02-host-and-server.ts", "reminder"]
 *     }
 *   }
 * }
 *
 * 每个 Server 运行在独立的进程中，但 AI 可以同时使用它们。
 */

// ============================================================
// 根据命令行参数决定启动哪个 Server
// ============================================================
const mode = process.argv[2] ?? "file";

let server: McpServer;

switch (mode) {
  case "file":
    server = createFileServer();
    break;
  case "weather":
    server = createWeatherServer();
    break;
  case "reminder":
    server = createReminderServer();
    break;
  default:
    console.error(`未知模式：${mode}`);
    process.exit(1);
}

const transport = new StdioServerTransport();
server.run(transport);
