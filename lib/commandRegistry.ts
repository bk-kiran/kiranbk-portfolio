import type { ReactNode } from 'react';

export interface Command {
  name: string;
  aliases?: string[];
  description: string;
  usage?: string;
  handler(args: string[], flags: Record<string, boolean | string>): ReactNode;
}

interface ParsedInput {
  commandName: string;
  args: string[];
  flags: Record<string, boolean | string>;
}

export function parseInput(raw: string): ParsedInput {
  const tokens = raw.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return { commandName: '', args: [], flags: {} };
  }

  const [commandName, ...rest] = tokens;
  const args: string[] = [];
  const flags: Record<string, boolean | string> = {};

  for (const token of rest) {
    if (token.startsWith('--')) {
      const body = token.slice(2);
      const eqIdx = body.indexOf('=');
      if (eqIdx !== -1) {
        flags[body.slice(0, eqIdx)] = body.slice(eqIdx + 1);
      } else {
        flags[body] = true;
      }
    } else {
      args.push(token);
    }
  }

  return { commandName, args, flags };
}

export class CommandRegistry {
  private commands = new Map<string, Command>();

  register(cmd: Command): void {
    this.commands.set(cmd.name, cmd);
  }

  resolve(name: string): Command | undefined {
    for (const cmd of this.commands.values()) {
      if (cmd.name === name || cmd.aliases?.includes(name)) {
        return cmd;
      }
    }
    return undefined;
  }

  execute(raw: string): ReactNode {
    const { commandName, args, flags } = parseInput(raw);
    if (!commandName) return null;
    const cmd = this.resolve(commandName);
    if (!cmd) return `command not found: ${commandName}`;
    return cmd.handler(args, flags);
  }
}

export const registry = new CommandRegistry();
