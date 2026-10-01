// Servidor de vista previa únicamente; la app no necesita compilación.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const assets = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
  '/main.js': ['main.js', 'text/javascript; charset=utf-8'],
  '/games/prueba.js': ['games/prueba.js', 'text/javascript; charset=utf-8'],
  '/games/memorama.js': ['games/memorama.js', 'text/javascript; charset=utf-8'],
  '/games/fantasma.js': ['games/fantasma.js', 'text/javascript; charset=utf-8'],
  '/games/intruso.js': ['games/intruso.js', 'text/javascript; charset=utf-8'],
};

createServer(async (req, res) => {
  const asset = assets[new URL(req.url, 'http://preview.local').pathname];
  if (!asset) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  try {
    const content = await readFile(new URL(asset[0], import.meta.url));
    res.writeHead(200, {
      'Content-Type': asset[1],
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(content);
  } catch {
    res.writeHead(500);
    res.end('Unable to load asset');
  }
}).listen(Number(process.env.PORT), '0.0.0.0');