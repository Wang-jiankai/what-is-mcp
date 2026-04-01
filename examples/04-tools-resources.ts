/**
 * 04-tools-resources.ts — 工具与资源完整示例
 *
 * 本章知识点：concepts/04 - 工具与资源
 *
 * 本示例展示 Tool 和 Resource 的完整定义方式：
 *   - Tool：带 zod 参数验证的工具
 *   - Resource：静态资源和动态资源
 *   - Resource URI 模板：带变量的资源路径
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";

const server = new McpServer({ name: "store-server", version: "1.0.0" });

// ============================================================
// Tool：带完整参数验证的"创建订单"工具
// ============================================================
server.tool(
  "createOrder",
  {
    productId: z.string().min(1, "商品 ID 不能为空"),
    quantity: z.number().int().min(1, "数量至少为 1"),
    address: z.string().min(10, "地址太短"),
    phone: z.string().regex(/^\d{11}$/, "手机号必须是 11 位数字")
  },
  async ({ productId, quantity, address, phone }) => {
    const orderId = `ORD-${Date.now()}`;
    return {
      content: [
        {
          type: "text" as const,
          text: `订单创建成功！订单号：${orderId}，商品：${productId}，数量：${quantity}`
        }
      ]
    };
  }
);

// ============================================================
// Resource：静态资源（产品目录）
// ============================================================
server.resource(
  "product-catalog",
  "store://products/catalog",
  {
    products: [
      { id: "P001", name: "笔记本电脑", price: 5999, stock: 50 },
      { id: "P002", name: "无线鼠标", price: 99, stock: 200 },
      { id: "P003", name: "机械键盘", price: 399, stock: 80 }
    ]
  }
);

// ============================================================
// Resource：动态资源（库存查询）
// ============================================================
server.resource(
  "product-stock",
  "store://products/{productId}/stock",
  async (uri) => {
    const productId = uri.params.productId as string;
    // 模拟数据库查询
    const stockMap: Record<string, number> = {
      P001: 50,
      P002: 200,
      P003: 80
    };
    const stock = stockMap[productId] ?? 0;
    return { productId, stock, lastUpdated: new Date().toISOString() };
  }
);

// ============================================================
// Resource：用户信息（带多级路径变量）
// ============================================================
server.resource(
  "user-info",
  "store://users/{userId}/profile",
  async (uri) => {
    const { userId } = uri.params;
    // 模拟数据库查询
    return {
      userId,
      name: "张三",
      email: "zhangsan@example.com",
      memberSince: "2024-01-01"
    };
  }
);

// ============================================================
// 启动
// ============================================================
const transport = new StdioServerTransport();
server.run(transport);
