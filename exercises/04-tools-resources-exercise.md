# 04 | 练习：深入理解工具与资源

## 🎯 练习目标

- 掌握 Tool 的 zod 参数验证
- 理解 Resource URI 模板的用法
- 能够设计一个完整的多工具、多资源 Server

---

## 📋 练习要求

### 基础任务（必做）

**设计一个"图书馆" MCP Server**，包含以下内容：

**Tools（至少 3 个）：**
| 工具名 | 参数 | 功能 |
|--------|------|------|
| `borrowBook` | `bookId: string, borrower: string` | 借书 |
| `returnBook` | `bookId: string` | 还书 |
| `searchBooks` | `query: string` | 搜索书籍 |

**Resources（至少 2 个）：**
| 资源名 | URI | 内容 |
|--------|-----|------|
| `bookList` | `library://books` | 全部书籍列表 |
| `bookDetail` | `library://books/{bookId}` | 单本书详情 |

**用 zod 定义每个工具的参数 schema**

### 进阶任务（选做）

**扩展图书馆 Server，增加以下功能：**

1. `borrowBook` 在借书时检查库存是否为 0，如果是则返回错误
2. `bookDetail` 资源通过 URI 模板获取 `{bookId}` 参数，返回对应书籍信息

---

## 💡 提示

- 本练习对应的概念文章：[`concepts/04-tools-and-resources.md`](../concepts/04-tools-and-resources.md)
- 参考答案：[`references/04-tools-resources-solution.ts`](../references/04-tools-resources-solution.ts)
