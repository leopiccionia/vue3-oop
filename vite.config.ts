import { defineConfig } from 'vite'
import vueJsx from '@vue3-oop/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import { createTransformer } from 'static-injector/transform'

export default defineConfig(({ command, mode }) => {
  return {
    esbuild: false, // esbuild不支持装饰器
    plugins: [
      typescript({
        check: false,
        tsconfigOverride: {
          // sourcemap有问题,先关闭sm
          compilerOptions: { sourceMap: false },
        },
        transformers: [
          (service) => ({
            before: [createTransformer(service.getProgram()!)],
          }),
        ],
      }),
      vueJsx(),
    ],
    resolve: {
      alias: [
        { find: /^~/, replacement: '' },
        { find: '@/', replacement: '/src/' },
        { find: 'vue3-oop', replacement: '/src/' },
      ],
    },
    server: {
      open: '/',
    },
    build: {
      target: 'es2015',
      lib: {
        entry: 'src/index.ts',
        name: 'vue3-oop-static',
        fileName: (format) => `vue3-oop-static.${format}.js`,
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: ['vue', 'injection-js'],
      },
      minify: false,
    },
  }
})
