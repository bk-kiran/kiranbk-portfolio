import { registry } from '@/lib/commandRegistry';

// Terminal.tsx intercepts 'clear' before registry.execute — this registration
// exists so help and registry.resolve('clear') work correctly.
registry.register({
  name: 'clear',
  description: 'clear screen',
  handler() {
    return null;
  },
});
