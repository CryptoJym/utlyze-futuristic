# MCP Bridge (HTTP + CLI)

A minimal bridge to access MCP tools from this environment. It supports:

- HTTP server with two backends:
  - BACKEND=http: proxies to an MCP Gateway or compatible REST
  - BACKEND=stdio: invokes a local stdio command that accepts a single JSON input and prints JSON output
- CLI wrapper to call the stdio command directly

## Quick start

```bash
cd /workspace/mcp-bridge
npm run build
PORT=8787 MCP_BACKEND=stdio MCP_STDIO_CMD="/path/to/your-mcp-client --args" node dist/server.js
# In another terminal
curl http://127.0.0.1:8787/health
```

## Configuration

Environment variables:

- PORT: HTTP port (default: 8787)
- MCP_BACKEND: "stdio" (default) or "http"
- MCP_BASE_URL: when MCP_BACKEND=http, base URL of the MCP gateway (e.g., http://host:port)
- MCP_AUTH_HEADER: optional Authorization header value (e.g., "Bearer TOKEN")
- MCP_STDIO_CMD: when MCP_BACKEND=stdio, command to execute. It must read a single JSON payload on stdin and print JSON to stdout.

## Endpoints

- GET /health -> { ok: true, backend }
- GET /tools -> list tools (delegated to backend)
- POST /call { method: string, params?: object } -> result (delegated to backend)

## CLI

```bash
npm run cli -- --stdio-cmd "${MCP_STDIO_CMD}" --action list-tools
npm run cli -- --stdio-cmd "${MCP_STDIO_CMD}" --action call --method my.tool --params '{"arg": 1}'
```

## Notes

- The stdio backend expects your command to understand a simple contract:
  - Input for list: { "action": "listTools" }
  - Input for call: { "action": "call", "method": string, "params": object }
  - Output: JSON on stdout
- If you have an MCP Gateway exposing REST, set MCP_BACKEND=http and MCP_BASE_URL accordingly.