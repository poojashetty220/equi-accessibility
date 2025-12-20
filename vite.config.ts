import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Library build mode
  if (mode === 'lib') {
    return {
      plugins: [
        react(),
        tailwindcss(),
        dts({
          include: ['src/Accessibility/**/*'],
          outDir: 'dist',
          tsconfigPath: './tsconfig.app.json',
        }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/Accessibility/index.ts'),
          name: 'EquiAccessible',
          fileName: 'equiaccessible',
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'jsxRuntime',
            },
          },
        },
        cssCodeSplit: false,
      },
    }
  }

  // Development mode (default)
  return {
    plugins: [react(), tailwindcss()],
  }
})
