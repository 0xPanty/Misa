import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // 後端URL: 環境変数 VITE_BACKEND_URL または空文字(プロキシ使用)
  const backendUrl = env.VITE_BACKEND_URL || ''
  
  return {
    root: 'src',
    publicDir: '../public',
    define: {
      __AGUI_BASE__: JSON.stringify(backendUrl),
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    server: {
      proxy: {
        '/agui': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },
  }
})
