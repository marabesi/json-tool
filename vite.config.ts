import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const plugins: import('vite').PluginOption[] = [react()];

  // Enable Istanbul instrumentation only when running the instrumented dev server
  // (used for Cypress E2E code coverage via @cypress/code-coverage)
  if (process.env.VITE_COVERAGE === 'true') {
    const { default: istanbul } = await import('vite-plugin-istanbul');
    plugins.push(
      istanbul({
        include: 'src/**',
        exclude: ['node_modules', 'src/__test__/**'],
        extension: ['.js', '.ts', '.tsx'],
        requireEnv: false,
        cypress: true,
      })
    );
  }

  return {
    plugins,
    base: './',
    build: {
      outDir: 'build',
      sourcemap: true,
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
  };
});
