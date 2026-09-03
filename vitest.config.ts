import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify('test') },
  test: {
    environment: 'happy-dom',
    include: ['test/**/*.test.{ts,tsx}'],
    // @rave-page/ui ships compiled ESM with extensionless relative imports
    // (fine for esbuild, our shipping bundler). Inline it so Vite transforms +
    // resolves it instead of externalizing to Node's stricter ESM loader.
    server: { deps: { inline: ['@rave-page/ui'] } },
  },
});
