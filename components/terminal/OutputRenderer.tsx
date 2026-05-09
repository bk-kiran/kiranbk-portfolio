import type { ReactNode } from 'react';

interface Props {
  output: ReactNode;
}

export default function OutputRenderer({ output }: Props) {
  if (typeof output === 'string') {
    const isError = output.startsWith('command not found:');
    return (
      <div
        className="whitespace-pre-wrap leading-relaxed"
        style={{ color: isError ? 'var(--t-red)' : 'var(--t-text-dim)' }}
      >
        {output}
      </div>
    );
  }
  return <div className="leading-relaxed">{output}</div>;
}
