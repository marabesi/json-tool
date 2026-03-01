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
      })
    );
  }

  return {
    plugins,
    // Use public/ as Vite root so index.html lives there alongside static assets.
    // publicDir is disabled because the root itself acts as the static-assets folder.
    root: 'public',
    publicDir: false,
    base: './',
    build: {
      outDir: '../build',
      sourcemap: true,
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
  };
});
