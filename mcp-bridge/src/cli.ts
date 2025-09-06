#!/usr/bin/env node
import { z } from 'zod';
import { spawn } from 'node:child_process';

const args = process.argv.slice(2);

const schema = z.object({
  action: z.enum(['list-tools', 'call']),
  method: z.string().optional(),
  params: z.string().optional(), // JSON string
  stdioCmd: z.string(),
});

function parseArgs(argv: string[]): z.infer<typeof schema> {
  const out: any = { action: 'list-tools' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--action') out.action = argv[++i];
    else if (a === '--method') out.method = argv[++i];
    else if (a === '--params') out.params = argv[++i];
    else if (a === '--stdio-cmd') out.stdioCmd = argv[++i];
  }
  return schema.parse(out);
}

async function run() {
  const { action, method, params, stdioCmd } = parseArgs(args);
  const payload = action === 'list-tools'
    ? { action: 'listTools' }
    : { action: 'call', method, params: params ? JSON.parse(params) : {} };
  const result = await runStdio(stdioCmd, JSON.stringify(payload));
  process.stdout.write(result + '\n');
}

run().catch((err) => {
  console.error(String(err?.stack || err));
  process.exit(1);
});

function runStdio(cmd: string, inputJson: string): Promise<string> {
  const [command, ...args] = splitCommand(cmd);
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
      } else {
        resolve(stdout.trim());
      }
    });
    child.stdin.write(inputJson);
    child.stdin.end();
  });
}

function splitCommand(cmd: string): string[] {
  const re = /(?:\"([^\"]*)\"|'([^']*)'|([^\s]+))/g;
  const parts: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(cmd)) !== null) {
    parts.push(m[1] ?? m[2] ?? m[3] ?? '');
  }
  return parts;
}

