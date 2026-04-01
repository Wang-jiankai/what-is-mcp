# 05 | 参考答案：探索 MCP 生态

## 📋 基础任务参考答案

### filesystem-server 完整配置示例

**步骤 1：安装**
```bash
npm install -g @modelcontextprotocol/server-filesystem
```

**步骤 2：配置 Claude Desktop**

在 `claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "/Users/你的用户名/Desktop"
      ]
    }
  }
}
```

**步骤 3：重启 Claude Desktop，在新对话中测试**

尝试问：
- "列出桌面上的所有文件"
- "读取桌面上的 notes.txt 文件"

**预期结果**：Claude 会调用 filesystem-server 的工具，返回文件列表或文件内容。

---

### github-server 完整配置示例

**步骤 1：安装**
```bash
npm install -g @modelcontextprotocol/server-github
```

**步骤 2：配置**

需要先创建 GitHub Personal Access Token：
1. 打开 GitHub → Settings → Developer settings → Personal access tokens
2. 生成新令牌，选择 `repo` 和 `read:user` 权限

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "你的令牌"
      }
    }
  }
}
```

**步骤 3：测试**

尝试问：
- "我在 GitHub 上的仓库有哪些？"
- "帮我创建一个新 Issue"

---

## 📋 进阶任务参考答案

### MCP Server 设计方案示例

**Server 名称**：`notion-server`

**提供的工具**：
| 工具名 | 参数 | 功能 |
|--------|------|------|
| `createPage` | `title: string, content: string` | 在 Notion 中创建页面 |
| `searchPages` | `query: string` | 搜索 Notion 页面 |
| `addToDo` | `pageId: string, todo: string` | 添加待办事项 |

**解决的场景**：
- 研究人员可以用语音让 AI 自动整理笔记到 Notion
- 项目经理可以让 AI 自动更新任务状态

**目标用户**：
- Notion 重度用户
- 需要 AI 辅助知识管理的用户
