/**
 * 03-protocol-communication.ts — JSON-RPC 协议通信演示
 *
 * 本章知识点：concepts/03 - JSON-RPC 协议
 *
 * 本示例展示 MCP 的通信格式：
 *   - 请求（Request）：调用工具时发送
 *   - 响应（Response）：工具执行结果
 *   - 通知（Notification）：Server 主动告知 Host 事件
 *
 * 这是一个"演示脚本"，展示 MCP 的通信结构，不实际运行 Server。
 */

// ============================================================
// JSON-RPC 2.0 请求示例
// ============================================================
const toolCallRequest = {
  jsonrpc: "2.0",              // JSON-RPC 版本（固定为 "2.0"）
  id: 1,                       // 请求 ID（用于匹配响应）
  method: "tools/call",        // MCP 方法名
  params: {
    name: "add",               // 工具名称
    arguments: { a: 5, b: 3 }  // 工具参数
  }
};

// ============================================================
// JSON-RPC 2.0 成功响应示例
// ============================================================
const successResponse = {
  jsonrpc: "2.0",
  id: 1,                       // 与请求的 ID 对应
  result: {
    content: [
      {
        type: "text",
        text: "5 + 3 = 8"
      }
    ]
  }
};

// ============================================================
// JSON-RPC 2.0 错误响应示例
// ============================================================
const errorResponse = {
  jsonrpc: "2.0",
  id: 2,
  error: {
    code: -32602,              // 错误码（-32602 = Invalid params）
    message: "除数不能为 0"
  }
};

// ============================================================
// JSON-RPC 2.0 通知示例（不需要响应）
// ============================================================
const notification = {
  jsonrpc: "2.0",
  method: "notifications/message",
  params: {
    level: "info",
    data: "工具执行完成"
  }
};

// ============================================================
// 打印示例
// ============================================================
console.log("=== JSON-RPC 请求示例 ===");
console.log(JSON.stringify(toolCallRequest, null, 2));

console.log("\n=== JSON-RPC 成功响应 ===");
console.log(JSON.stringify(successResponse, null, 2));

console.log("\n=== JSON-RPC 错误响应 ===");
console.log(JSON.stringify(errorResponse, null, 2));

console.log("\n=== JSON-RPC 通知（单向，不需要响应）===");
console.log(JSON.stringify(notification, null, 2));

// ============================================================
// 传输方式对比
// ============================================================
console.log("\n=== 传输方式对比 ===");
console.log("stdio（本地）: Server 作为子进程，stdin 收请求，stdout 发响应");
console.log("HTTP（远程）: Server 部署在远端，通过 HTTP POST 发送请求");

// ============================================================
// 关键错误码
// ============================================================
console.log("\n=== 常见 JSON-RPC 错误码 ===");
console.log("-32600: Invalid Request（无效请求）");
console.log("-32602: Invalid Params（参数错误）");
console.log("-32603: Internal Error（服务器内部错误）");
console.log("-32700: Parse Error（JSON 解析失败）");
