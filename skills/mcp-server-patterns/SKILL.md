---
name: mcp-server-patterns
description: Build Model Context Protocol servers — AI integration, resource tools, best practices
triggers: [MCP, server, Model Context Protocol, integration, tool, resource, build MCP]
---

# SKILL: MCP Server Patterns

## What is MCP?

```
Model Context Protocol: lets Claude directly use your tools/data

Without MCP: User → AI → API call → tool
With MCP: AI directly calls your tools (integrated)

Benefits:
  - Claude can directly use your databases, APIs, files
  - Better performance (no API gateway overhead)
  - More reliable (no network calls from AI to your API)
```

## Basic MCP Server

```python
# mcp/server.py
from mcp.server import Server
from mcp.types import Tool, TextContent

server = Server("my-tools")

@server.tool(name="fetch_user")
async def fetch_user(user_id: str) -> str:
    """Get user by ID"""
    user = await db.users.get(user_id)
    return json.dumps(user.dict())

@server.tool(name="create_user")
async def create_user(email: str, name: str) -> str:
    """Create new user"""
    user = await db.users.create(email=email, name=name)
    return json.dumps({"success": True, "user_id": user.id})

if __name__ == "__main__":
    server.run()
```

## .mcp.json Configuration

```json
{
  "mcpServers": {
    "database": {
      "command": "python",
      "args": ["mcp/server.py"],
      "env": {
        "DATABASE_URL": "postgresql://...",
        "API_KEY": "..."
      }
    },
    "filesystem": {
      "command": "python",
      "args": ["tools/filesystem_mcp.py"],
      "env": {
        "ROOT_DIR": "/home/user/project"
      }
    }
  }
}
```

## Common MCP Servers to Build

```
1. Database MCP
   - Tools: query, insert, update, delete
   - When: Claude needs real-time data access

2. Filesystem MCP
   - Tools: read_file, write_file, list_directory
   - When: Claude needs to read/write files

3. Git MCP
   - Tools: commit, push, branch, diff
   - When: Claude needs to make git changes

4. API Gateway MCP
   - Tools: make HTTP requests
   - When: Claude needs to call your APIs

5. Search MCP
   - Tools: search knowledge base, docs, web
   - When: Claude needs to find information
```

## Best Practices

```
✅ Return structured data (JSON, not prose)
✅ Validate inputs (don't trust Claude)
✅ Add error handling (return error messages)
✅ Log all operations (audit trail)
✅ Rate limit (prevent abuse)
✅ Test thoroughly (MCP errors break Claude)

❌ Don't return raw database dumps
❌ Don't expose sensitive data
❌ Don't create unbounded side effects
```

## Quality checks
- [ ] Server implements N tools
- [ ] All tools have input validation
- [ ] Error handling in place
- [ ] Logging configured
- [ ] .mcp.json configured correctly
- [ ] Tested with Claude
- [ ] Rate limiting implemented
