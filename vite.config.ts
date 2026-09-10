import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'vite-plugin-leetcode-dev-api',
      configureServer(server) {
        server.middlewares.use('/api/leetcode', async (_req, res) => {
          try {
            const { fetchLeetCodeProfile } = await import('./api/leetcode.ts');
            const data = await fetchLeetCodeProfile('Aadesh_2006');
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(data));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to fetch LeetCode data', isLive: false }));
          }
        });
      }
    }
  ],
})
