const http = require('node:http');
const { parse: parseUrl } = require('node:url');
const fs = require('node:fs');
const path = require('node:path');

const DIST_DIR = path.join(__dirname, '..', 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch {
    const index = fs.readFileSync(path.join(DIST_DIR, 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(index);
  }
}

const lugares    = require('./routes/lugares.js');
const eventos    = require('./routes/eventos.js');
const servicios  = require('./routes/servicios.js');
const mapa       = require('./routes/mapa.js');
const actividades= require('./routes/actividades.js');
const juegos     = require('./routes/juegos.js');

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  const { pathname, query } = parseUrl(req.url, true);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method !== 'GET')     { res.writeHead(405); return res.end(JSON.stringify({ error: 'Method not allowed' })); }

  try {
    // /api/lugares/:id
    const lugarById = pathname.match(/^\/api\/lugares\/([^/]+)$/);
    if (lugarById) return lugares.byId(req, res, query, lugarById[1]);

    const routes = {
      '/api/lugares':    () => lugares.list(req, res, query),
      '/api/eventos':    () => eventos.list(req, res, query),
      '/api/servicios':  () => servicios.list(req, res, query),
      '/api/mapa':       () => mapa.list(req, res, query),
      '/api/actividades':() => actividades.list(req, res, query),
      '/api/juegos':     () => juegos.list(req, res, query),
    };

    const handler = routes[pathname];
    if (handler) return handler();

    // Servir archivos estáticos del frontend (build de Vite)
    if (fs.existsSync(DIST_DIR)) {
      res.removeHeader('Content-Type');
      const filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);
      return serveStatic(res, filePath);
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found', path: pathname }));
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error', message: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`🌿 API Colón360 corriendo en http://localhost:${PORT}`);
  console.log(`   Rutas: /api/lugares /api/eventos /api/servicios /api/mapa /api/actividades /api/juegos`);
});
