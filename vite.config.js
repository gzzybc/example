import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import eslintPlugin from 'vite-plugin-eslint'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.ts', 'src/**/*.tsx', 'src/**/*.jsx']
    })
    // viteExternalsPlugin({
    //   vue: 'Vue',
    //   react: 'React',
    //   'react-dom': 'ReactDOM',
    //   // value support chain, transform to window['React']['lazy']
    //   lazy: ['React', 'lazy']
    // })
  ]
})
