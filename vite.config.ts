import { defineConfig } from 'vite';
import { resolve } from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      onwarn(warning, defaultHandler) {
        if (
          warning.message.indexOf(
            'depends on more than 10 external files which can cause slow builds and poor DX',
          ) === -1
        ) {
          defaultHandler(warning);
        }
      },
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
});
