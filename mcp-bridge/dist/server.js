import express from 'express';
import { z } from 'zod';
import { request } from 'undici';
import { spawn } from 'node:child_process';
// Configuration via environment variables
const PORT = Number(process.env.PORT || 8787);
const BACKEND = process.env.MCP_BACKEND || 'stdio'; // 'stdio' | 'http'
// For BACKEND=http
const MCP_BASE_URL = process.env.MCP_BASE_URL || '';
const MCP_AUTH_HEADER = process.env.MCP_AUTH_HEADER || '';
// For BACKEND=stdio
// Command to launch an MCP-capable client that accepts JSON-RPC on stdio
// Example: MCP_STDIO_CMD="/usr/bin/my-mcp-client --server ws://..."
const MCP_STDIO_CMD = process.env.MCP_STDIO_CMD || '';
const app = express();
app.use(express.json({ limit: '2mb' }));
// Schemas
const callSchema = z.object({
    method: z.string(),
    params: z.record(z.any()).optional(),
});
// Health
app.get('/health', (_req, res) => {
    res.json({ ok: true, backend: BACKEND });
});
// List tools (best-effort, backend-specific)
app.get('/tools', async (_req, res) => {
    try {
        if (BACKEND === 'http') {
            if (!MCP_BASE_URL)
                throw new Error('MCP_BASE_URL not set');
            const url = `${MCP_BASE_URL.replace(/\/$/, '')}/tools`;
            const headers = { 'content-type': 'application/json' };
            if (MCP_AUTH_HEADER)
                headers['authorization'] = MCP_AUTH_HEADER;
            const r = await request(url, { method: 'GET', headers });
            const body = await r.body.json();
            res.json(body);
            return;
        }
        if (BACKEND === 'stdio') {
            if (!MCP_STDIO_CMD)
                throw new Error('MCP_STDIO_CMD not set');
            const result = await runStdio(JSON.stringify({ action: 'listTools' }));
            res.json(parseJsonSafe(result));
            return;
        }
        throw new Error(`Unsupported backend: ${BACKEND}`);
    }
    catch (err) {
        res.status(500).json({ error: err?.message || String(err) });
    }
});
// Call a tool
app.post('/call', async (req, res) => {
    try {
        const parsed = callSchema.parse(req.body);
        if (BACKEND === 'http') {
            if (!MCP_BASE_URL)
                throw new Error('MCP_BASE_URL not set');
            const url = `${MCP_BASE_URL.replace(/\/$/, '')}/call`;
            const headers = { 'content-type': 'application/json' };
            if (MCP_AUTH_HEADER)
                headers['authorization'] = MCP_AUTH_HEADER;
            const r = await request(url, { method: 'POST', headers, body: JSON.stringify(parsed) });
            const body = await r.body.json();
            res.json(body);
            return;
        }
        if (BACKEND === 'stdio') {
            if (!MCP_STDIO_CMD)
                throw new Error('MCP_STDIO_CMD not set');
            const payload = JSON.stringify({ action: 'call', method: parsed.method, params: parsed.params || {} });
            const result = await runStdio(payload);
            res.json(parseJsonSafe(result));
            return;
        }
        throw new Error(`Unsupported backend: ${BACKEND}`);
    }
    catch (err) {
        res.status(400).json({ error: err?.message || String(err) });
    }
});
// Utility: run a command that reads a single line JSON on stdin and prints JSON on stdout
async function runStdio(inputJson) {
    const [command, ...args] = splitCommand(MCP_STDIO_CMD);
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] });
        let stdout = '';
        let stderr = '';
        child.stdout.on('data', (d) => { stdout += String(d); });
        child.stderr.on('data', (d) => { stderr += String(d); });
        child.on('error', reject);
        child.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`stdio command exited with ${code}: ${stderr || stdout}`));
            }
            else {
                resolve(stdout.trim());
            }
        });
        child.stdin.write(inputJson);
        child.stdin.end();
    });
}
function splitCommand(cmd) {
    // naive split respecting quoted args (simple)
    const re = /(?:\"([^\"]*)\"|'([^']*)'|([^\s]+))/g;
    const parts = [];
    let m;
    while ((m = re.exec(cmd)) !== null) {
        parts.push(m[1] ?? m[2] ?? m[3] ?? '');
    }
    return parts;
}
function parseJsonSafe(s) {
    try {
        return JSON.parse(s);
    }
    catch {
        return { raw: s };
    }
}
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`MCP bridge listening on http://localhost:${PORT} backend=${BACKEND}`);
});
//# sourceMappingURL=server.js.map