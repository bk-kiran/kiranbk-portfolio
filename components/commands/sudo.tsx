import { registry } from '@/lib/commandRegistry';
import { contact } from '@/lib/data';

const MAILTO = `mailto:${contact.email}?subject=${encodeURIComponent("Let's talk — saw your portfolio")}&body=${encodeURIComponent("Hi Kiran,")}`;

registry.register({
  name: 'sudo',
  description: 'elevated commands',
  usage: 'sudo hire-me',
  handler(args) {
    if (args[0] !== 'hire-me') {
      return (
        <span style={{ color: 'var(--color-red)' }}>
          sudo: unknown command &quot;{args[0] ?? ''}&quot; — did you mean `sudo hire-me`?
        </span>
      );
    }

    if (typeof window !== 'undefined') {
      window.location.href = MAILTO;
    }

    return (
      <span style={{ color: 'var(--color-green)' }}>
        // drafted — opening mail client
      </span>
    );
  },
});
