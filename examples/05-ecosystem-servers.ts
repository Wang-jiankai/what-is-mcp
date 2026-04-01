/**
 * 05-ecosystem-servers.ts — MCP 生态 Server 演示
 *
 * 本章知识点：concepts/05 - MCP 生态与应用
 *
 * 本示例展示如何使用官方 MCP Server（通过 npm 安装后直接使用）。
 * 不需要写代码，只需要配置即可。
 */

// ============================================================
// 官方 MCP Server 一览
// ============================================================
/**
 * 1. filesystem-server
 *    npm: @modelcontextprotocol/server-filesystem
 *    用途: 本地文件读写
 *    配置: claude_desktop_config.json
 *    {
 *      "mcpServers": {
 *        "filesystem": {
 *          "command": "npx",
 *          "args": ["@modelcontextprotocol/server-filesystem", "/path/to/dir"]
 *        }
 *      }
 *    }
 *
 * 2. github-server
 *    npm: @modelcontextprotocol/server-github
 *    用途: GitHub API 操作（创建 Issue、PR 等）
 *    配置: 需要 GITHUB_TOKEN 环境变量
 *
 * 3. postgres-server
 *    npm: @modelcontextprotocol/server-postgres
 *    用途: PostgreSQL 数据库查询
 *    配置: DATABASE_URL 环境变量
 *
 * 4. slack-server
 *    npm: @modelcontextprotocol/server-slack
 *    用途: 发送 Slack 消息
 *    配置: SLACK_BOT_TOKEN, SLACK_TEAM_ID 环境变量
 */

// ============================================================
// 演示：手动启动 filesystem-server
// ============================================================
console.log("=== MCP 生态 Server 快速启动指南 ===\n");

console.log("1. filesystem-server（文件系统）");
console.log("   npm install @modelcontextprotocol/server-filesystem");
console.log('   npx @modelcontextprotocol/server-filesystem ~/projects\n');

console.log("2. github-server（GitHub）");
console.log("   npm install @modelcontextprotocol/server-github");
console.log('   npx @modelcontextprotocol/server-github\n');

console.log("3. 配置到 Claude Desktop:");
console.log('   // 在 claude_desktop_config.json 中添加');
console.log('   {');
console.log('     "mcpServers": {');
console.log('       "filesystem": {');
console.log('         "command": "npx",');
console.log('         "args": ["@modelcontextprotocol/server-filesystem", "~/Desktop"]');
console.log('       }');
console.log('     }');
console.log('   }\n');

console.log("4. 验证 Server 是否正常运行:");
console.log('   在 Claude Desktop 中问："列出桌面上的所有文件"');
console.log("   如果能正常回答，说明 Server 已连接成功。");
