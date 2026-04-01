# 03 | 练习：理解 JSON-RPC 协议

## 🎯 练习目标

- 理解 JSON-RPC 2.0 的消息格式
- 掌握 MCP 请求和响应的结构
- 了解两种传输方式的区别

---

## 📋 练习要求

### 基础任务（必做）

**分析以下 JSON-RPC 消息，指出每个消息的类型和组成部分：**

```json
// 消息 1
{
  "jsonrpc": "2.0",
  "id": 42,
  "method": "tools/list",
  "params": {}
}

// 消息 2
{
  "jsonrpc": "2.0",
  "id": 42,
  "result": {
    "tools": [
      { "name": "readFile", "description": "读取文件" }
    ]
  }
}

// 消息 3
{
  "jsonrpc": "2.0",
  "id": 99,
  "error": {
    "code": -32602,
    "message": "参数错误：phone 必须是 11 位数字"
  }
}
```

**对于每个消息，回答：**
1. 这是请求、响应还是通知？
2. method / result / error 字段分别是什么？
3. id 字段的作用是什么？

### 进阶任务（选做）

**画出 stdio 和 HTTP 两种传输方式的数据流图**

```
stdio 方式：
Host ←→ Server

HTTP 方式：
Host ←→ HTTP ←→ Server
```

说明哪种方式适合本地运行，哪种适合远程部署。

---

## 💡 提示

- 本练习对应的概念文章：[`concepts/03-json-rpc-protocol.md`](../concepts/03-json-rpc-protocol.md)
- 参考答案：[`references/03-protocol-solution.md`](../references/03-protocol-solution.md)
