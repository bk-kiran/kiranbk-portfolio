import { registry } from '@/lib/commandRegistry';

const COMMANDS: [string, string][] = [
  ['whoami',                   'print bio'],
  ['help',                     'show this message'],
  ['experience [--full]',      'list work history; --full for all entries with details'],
  ['projects [--featured|--all]', 'list builds; default shows featured'],
  ['skills',                   'languages, frameworks, infra, AI/ML'],
  ['contact',                  'email · github · linkedin · resume'],
  ['ask <question>',           'query the AI assistant'],
  ['run <app>',                'wordle · pomodoro · gpa'],
  ['theme <name>',             'tokyonight · solarized · nord · paper'],
  ['clear',                    'clear screen'],
  ['sudo hire-me',             'draft a hire-me email'],
  ['neofetch',                 'system info'],
];

registry.register({
  name: 'help',
  aliases: ['?', 'h'],
  description: 'show this message',
  handler() {
    return (
      <div className="space-y-1">
        {COMMANDS.map(([cmd, desc]) => (
          <div key={cmd} className="flex gap-4 items-baseline">
            <span
              className="shrink-0 text-xs"
              style={{
                color: 'var(--color-green)',
                minWidth: '220px',
                display: 'inline-block',
              }}
            >
              {cmd}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
              {desc}
            </span>
          </div>
        ))}
      </div>
    );
  },
});
