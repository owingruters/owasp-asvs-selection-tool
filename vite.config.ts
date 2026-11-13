import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative base so the static build works on GitHub Pages under any repo name.
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test-setup.ts', 'src/main.tsx'],
      // Light for now; raise as the app grows (see docs/ROADMAP-GUARDRAILS.md).
      thresholds: { lines: 60, functions: 60, branches: 60, statements: 60 },
    },
  },
});
