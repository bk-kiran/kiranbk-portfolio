import { experience } from '@/lib/data/experience';
import { projects } from '@/lib/data/projects';
import { education } from '@/lib/data/education';
import { skills } from '@/lib/data/skills';
import { personal, contact } from '@/lib/data/personal';

export type LineType = 'input' | 'output' | 'error' | 'dim' | 'accent' | 'heading';
export type Line = { type: LineType; text: string; indent?: number; href?: string };

export type AppKey = 'wordle' | 'snake' | 'typing' | 'matrix' | 'trivia';

export const APPS: { key: AppKey; label: string; desc: string }[] = [
  { key: 'wordle', label: 'wordle',    desc: 'daily wordle — every answer is a word from my life' },
  { key: 'trivia', label: 'trivia',    desc: 'how well do you know Kiran? 5 quick questions' },
  { key: 'snake',  label: 'snake',     desc: 'classic snake with a local high-score table' },
  { key: 'typing', label: 'type test', desc: 'wpm test on programmer quotes' },
  { key: 'matrix', label: 'matrix',    desc: 'digital rain — any key to exit' },
];

export interface CommandContext {
  enterAsk: (question?: string) => void;
  launch: (app: AppKey) => void;
  clear: () => void;
  close: () => void;
}

interface Command {
  name: string;
  usage?: string;
  desc: string;
  hidden?: boolean;
  run: (args: string[], ctx: CommandContext) => Line[];
}

const out = (text: string, indent?: number): Line => ({ type: 'output', text, indent });
const dim = (text: string, indent?: number): Line => ({ type: 'dim', text, indent });
const heading = (text: string): Line => ({ type: 'heading', text });
const link = (label: string, href: string): Line => ({ type: 'accent', text: label, href });

const COMMANDS: Command[] = [
  {
    name: 'help',
    desc: 'list commands',
    run: () => [
      heading('commands'),
      ...COMMANDS.filter(c => !c.hidden).map(c => out(`${(c.usage ?? c.name).padEnd(22)} ${c.desc}`, 2)),
      dim("tip: ↑/↓ for history, tab to autocomplete"),
    ],
  },
  {
    name: 'ask',
    usage: 'ask [question]',
    desc: 'chat with kiran-bot (RAG over my résumé & projects)',
    run: (args, ctx) => {
      ctx.enterAsk(args.join(' ').trim() || undefined);
      return [dim('entering ~/ask … (esc to return)')];
    },
  },
  {
    name: 'whoami',
    desc: 'the short version',
    run: () => [
      { type: 'accent', text: personal.name },
      out(`${personal.degree} @ ${personal.school} · class of ${personal.classYear} · GPA ${personal.gpa}`),
      out('I build full-stack systems and AI/ML pipelines — from agentic backends to consumer products.'),
      dim('seeking:'),
      ...personal.seeking.map(s => out(`· ${s}`, 2)),
      dim("try 'experience', 'projects', or 'ask why hire Kiran?'"),
    ],
  },
  {
    name: 'experience',
    usage: 'experience [--full]',
    desc: 'where I have worked',
    run: args => {
      const full = args.includes('--full') || args.includes('-f');
      const lines: Line[] = [heading('experience')];
      for (const e of experience) {
        lines.push(out(`${e.company.padEnd(22)} ${e.role}`, 2));
        lines.push(dim(`${e.period}${e.location ? ` · ${e.location}` : ''}`, 25));
        if (full) {
          for (const b of e.bullets.filter(b => b && b !== 'soon')) lines.push(out(`– ${b}`, 4));
          if (e.tags?.length) lines.push(dim(e.tags.join(' · '), 4));
          lines.push(dim(''));
        }
      }
      if (!full) lines.push(dim("use 'experience --full' for details"));
      return lines;
    },
  },
  {
    name: 'projects',
    usage: 'projects [--featured]',
    desc: 'things I have built',
    run: args => {
      const featuredOnly = args.includes('--featured');
      const list = featuredOnly ? projects.filter(p => p.featured) : projects;
      const lines: Line[] = [heading(featuredOnly ? 'featured projects' : 'projects')];
      for (const p of list) {
        lines.push({ type: 'accent', text: `${p.name}${p.featured ? ' ★' : ''}`, indent: 2 });
        lines.push(out(p.oneliner, 4));
        lines.push(dim(`${p.tech.join(' · ')}  [${p.status.toLowerCase()}]`, 4));
        lines.push({ ...link(p.github.replace('https://', ''), p.github), indent: 4 });
        if (p.demo) lines.push({ ...link(p.demo.replace('https://', ''), p.demo), indent: 4 });
      }
      if (!featuredOnly) lines.push(dim("use 'projects --featured' for the highlights"));
      return lines;
    },
  },
  {
    name: 'skills',
    desc: 'languages, frameworks, infra, ai/ml',
    run: () => [
      heading('skills'),
      ...Object.entries(skills).map(([group, items]) =>
        out(`${group.padEnd(12)} ${items.map(i => i.name).join(', ')}`, 2)),
    ],
  },
  {
    name: 'education',
    desc: 'school, research & activities',
    run: () => education.flatMap(ed => [
      heading(ed.institution),
      out(`${ed.degree} · ${ed.period}`, 2),
      dim(`coursework: ${ed.coursework.join(', ')}`, 2),
      dim(''),
      ...ed.activities.map(a => out(`${a.name.padEnd(34)} ${a.period}`, 2)),
    ]),
  },
  {
    name: 'contact',
    desc: 'get in touch',
    run: () => [
      { ...link(`email     ${contact.email}`, `mailto:${contact.email}`) },
      { ...link(`github    ${contact.github.replace('https://', '')}`, contact.github) },
      { ...link(`linkedin  ${contact.linkedin.replace('https://', '')}`, contact.linkedin) },
      { ...link(`resume    ${contact.resume}`, contact.resume) },
    ],
  },
  {
    name: 'apps',
    desc: 'list mini apps & games',
    run: () => [
      heading('apps'),
      ...APPS.map(a => out(`${a.key.padEnd(10)} ${a.desc}`, 2)),
      dim("use 'run <app>' to launch"),
    ],
  },
  {
    name: 'run',
    usage: 'run <app>',
    desc: 'launch a mini app',
    run: (args, ctx) => {
      const key = args[0]?.toLowerCase();
      const app = APPS.find(a => a.key === key);
      if (!app) {
        return [
          { type: 'error', text: key ? `unknown app: ${key}` : 'usage: run <app>' },
          dim(`available: ${APPS.map(a => a.key).join(', ')}`),
        ];
      }
      ctx.launch(app.key);
      return [dim(`launching ${app.label}… (esc to return)`)];
    },
  },
  { name: 'clear', desc: 'clear the screen', run: (_, ctx) => { ctx.clear(); return []; } },
  { name: 'exit', desc: 'close the terminal', run: (_, ctx) => { ctx.close(); return []; } },

  // hidden aliases / easter eggs
  { name: 'about', desc: '', hidden: true, run: (a, c) => find('whoami')!.run(a, c) },
  { name: 'wordle', desc: '', hidden: true, run: (_, c) => find('run')!.run(['wordle'], c) },
  { name: 'snake', desc: '', hidden: true, run: (_, c) => find('run')!.run(['snake'], c) },
  { name: 'trivia', desc: '', hidden: true, run: (_, c) => find('run')!.run(['trivia'], c) },
  { name: 'ls', desc: '', hidden: true, run: () => [out('about/  experience/  projects/  skills/  education/  apps/  contact/')] },
  { name: 'sudo', desc: '', hidden: true, run: () => [{ type: 'error', text: 'nice try. this incident will be reported.' }] },
];

function find(name: string) {
  return COMMANDS.find(c => c.name === name);
}

/** Run a raw input string. Returns the lines to append after the echoed input. */
export function runCommand(raw: string, ctx: CommandContext): Line[] {
  const [name, ...args] = raw.trim().split(/\s+/);
  const cmd = find(name.toLowerCase());
  if (!cmd) return [{ type: 'error', text: `command not found: ${name}. try 'help'` }];
  return cmd.run(args, ctx);
}

/** Tab completion over visible command names and `run <app>`. */
export function complete(input: string): string | null {
  const lower = input.toLowerCase();
  if (lower.startsWith('run ')) {
    const partial = lower.slice(4);
    const match = APPS.filter(a => a.key.startsWith(partial));
    return match.length === 1 ? `run ${match[0].key}` : null;
  }
  if (lower.includes(' ')) return null;
  const matches = COMMANDS.filter(c => !c.hidden && c.name.startsWith(lower));
  return matches.length === 1 ? `${matches[0].name} ` : null;
}
