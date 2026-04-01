/**
 * 04-tools-resources-solution.ts — 第四章练习参考答案
 *
 * 对应练习：exercises/04-tools-resources-exercise.md
 * 对应概念：concepts/04-tools-and-resources.md
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";

const server = new McpServer({ name: "library-server", version: "1.0.0" });

// ============================================================
// 模拟数据
// ============================================================
interface Book {
  id: string;
  title: string;
  author: string;
  stock: number;
}

const books: Book[] = [
  { id: "B001", title: "《三国演义》", author: "罗贯中", stock: 3 },
  { id: "B002", title: "《水浒传》", author: "施耐庵", stock: 2 },
  { id: "B003", title: "《西游记》", author: "吴承恩", stock: 0 }
];

const borrowRecords: Array<{ bookId: string; borrower: string; borrowDate: string }> = [];

// ============================================================
// Tool 1：借书
// ============================================================
server.tool(
  "borrowBook",
  {
    bookId: z.string(),
    borrower: z.string().min(1, "借书人姓名不能为空")
  },
  async ({ bookId, borrower }) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) {
      return {
        content: [{ type: "text" as const, text: `错误：找不到书籍 ${bookId}` }],
        isError: true
      };
    }
    if (book.stock <= 0) {
      return {
        content: [{ type: "text" as const, text: `错误：${book.title} 库存为 0，无法借阅` }],
        isError: true
      };
    }
    book.stock -= 1;
    borrowRecords.push({ bookId, borrower, borrowDate: new Date().toISOString() });
    return {
      content: [
        {
          type: "text" as const,
          text: `借阅成功！《${book.title}》已被 ${borrower} 借走，剩余库存：${book.stock}`
        }
      ]
    };
  }
);

// ============================================================
// Tool 2：还书
// ============================================================
server.tool(
  "returnBook",
  { bookId: z.string() },
  async ({ bookId }) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) {
      return {
        content: [{ type: "text" as const, text: `错误：找不到书籍 ${bookId}` }],
        isError: true
      };
    }
    book.stock += 1;
    return {
      content: [
        { type: "text" as const, text: `还书成功！《${book.title}》已归还，剩余库存：${book.stock}` }
      ]
    };
  }
);

// ============================================================
// Tool 3：搜索书籍
// ============================================================
server.tool(
  "searchBooks",
  { query: z.string().min(1, "搜索关键词不能为空") },
  async ({ query }) => {
    const results = books.filter(
      (b) =>
        b.title.includes(query) ||
        b.author.includes(query) ||
        b.id.includes(query)
    );
    if (results.length === 0) {
      return { content: [{ type: "text" as const, text: "没有找到匹配的书籍" }] };
    }
    const lines = results.map((b) => `【${b.id}】《${b.title》} - ${b.author}（库存：${b.stock}）`);
    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  }
);

// ============================================================
// Resource 1：全部书籍列表
// ============================================================
server.resource(
  "bookList",
  "library://books",
  {
    books: books.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      available: b.stock > 0
    }))
  }
);

// ============================================================
// Resource 2：单本书详情（进阶任务：动态 URI 模板）
// ============================================================
server.resource(
  "bookDetail",
  "library://books/{bookId}",
  async (uri) => {
    const { bookId } = uri.params;
    const book = books.find((b) => b.id === bookId);
    if (!book) {
      return { error: `找不到书籍 ${bookId}` };
    }
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      stock: book.stock,
      status: book.stock > 0 ? "可借" : "已借完"
    };
  }
);

// ============================================================
// 启动
// ============================================================
const transport = new StdioServerTransport();
server.run(transport);
