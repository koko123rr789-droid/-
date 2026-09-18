import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function studyProxyPlugin(): Plugin {
  return {
    name: 'study-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/time', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify({ now: Date.now() }));
      });

      server.middlewares.use('/api/youtube/feed', async (req, res) => {
        try {
          const urlObj = new URL(req.url || '', `http://${req.headers.host}`);
          let channelId = urlObj.searchParams.get('channelId') || '';

          const channelMap: Record<string, string> = {
            'waleed-mohsen': 'UC-o4Nbu_f9wtSXaeXdhIVLg',
            'mohamed-abdelmaaboud': 'UCuFTsaKokXaSn3LlbvA9tdg',
            'mohamed-abdelgawad': 'UC86Lxry5JBmZBjTtxcdBLDQ',
            'englishawy': 'UCvgXAavYQuIVn6p_TdZIixw',
            'ahmed-essam': 'UCJM3cWvEQdGRVRrWbe3YrNA',
          };

          if (channelMap[channelId]) {
            channelId = channelMap[channelId];
          }

          if (!channelId || !channelId.startsWith('UC')) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid or missing channelId' }));
            return;
          }

          const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
          const response = await fetch(rssUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'application/xml,text/xml,*/*',
            },
          });

          if (!response.ok) {
            throw new Error(`YouTube RSS returned status ${response.status}`);
          }

          const xmlText = await response.text();

          // Simple robust regex parsing for Atom XML entries
          const entries: any[] = [];
          const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
          let match;

          while ((match = entryRegex.exec(xmlText)) !== null) {
            const block = match[1];
            const vidMatch = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
            const titleMatch = block.match(/<title>([^<]+)<\/title>/);
            const pubMatch = block.match(/<published>([^<]+)<\/published>/);
            const authorMatch = block.match(/<name>([^<]+)<\/name>/);
            const thumbMatch = block.match(/<media:thumbnail[^>]*url="([^"]+)"/);

            if (vidMatch && titleMatch) {
              const videoId = vidMatch[1].trim();
              const title = titleMatch[1]
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'");

              const published = pubMatch ? pubMatch[1].trim() : new Date().toISOString();
              const author = authorMatch ? authorMatch[1].trim() : '';
              const thumbnail = thumbMatch ? thumbMatch[1] : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

              entries.push({
                videoId,
                title,
                published,
                author,
                thumbnail,
                isShort: title.includes('#short') || title.includes('#Short') || block.includes('/shorts/'),
              });
            }
          }

          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=180');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({ channelId, count: entries.length, videos: entries }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err?.message || 'Failed to fetch YouTube feed' }));
        }
      });

      server.middlewares.use('/api/proxy', async (req, res) => {
        try {
          const urlObj = new URL(req.url || '', `http://${req.headers.host}`);
          let targetUrl = urlObj.searchParams.get('url');

          if (!targetUrl) {
            res.statusCode = 400;
            res.end('Missing url parameter');
            return;
          }

          if (!targetUrl.startsWith('http')) {
            targetUrl = 'https://' + targetUrl;
          }

          const response = await fetch(targetUrl, {
            redirect: 'follow',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
              'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
            },
          });

          let body = await response.text();
          const finalUrl = response.url || targetUrl;
          const parsed = new URL(finalUrl);
          const baseTag = `<base href="${parsed.origin}/" />`;

          if (body.includes('<head>')) {
            body = body.replace('<head>', `<head>${baseTag}`);
          } else if (body.includes('<head ')) {
            body = body.replace(/<head[^>]*>/, `$&${baseTag}`);
          } else {
            body = baseTag + body;
          }

          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(body);
        } catch (err: any) {
          res.statusCode = 502;
          res.end(`Proxy Error: ${err?.message || 'Failed to fetch platform'}`);
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), studyProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
