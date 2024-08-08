import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import {resolve} from 'node:path';

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({presets: [hydrogen.preset()]}),
    tsconfigPaths(),
  ],
  ssr: {
    optimizeDeps: {
      include: [
        'prop-types',
        'react-dom/client',
        'debounce',
        'scheduler',
        'react-reconciler',
        'react-reconciler/constants',
        'typographic-base/index',
        'textr',
      ],
    },
  },
  optimizeDeps: {
    include: [
      'clsx',
      'typographic-base/index',
      'react-use/esm/useScroll',
      'react-use/esm/useDebounce',
      'react-use/esm/useWindowScroll',
    ],
  },
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
  resolve: {
    alias: {
      'use-sync-external-store/shim/with-selector.js': resolve(
        __dirname,
        'alias/use-sync-external-store-with-selector.js',
      ),
      rehackt: 'react',
    },
  },
});
