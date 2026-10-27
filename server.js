'use strict';

// Dependency-free local demo server. Bind to loopback; this is not production auth.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const dataPath = path.join(root, 'app-data.json');
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };

function reply(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' });
  res.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 2_000_000) { reject(new Error('Request is too large')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(JSON.parse(raw)); } catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/api/health' && req.method === 'GET') return reply(res, 200, { ok: true, storage: 'local-json' });
  if (url.pathname === '/api/state' && req.method === 'GET') {
    try { return reply(res, 200, { state: fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath, 'utf8')) : null }); }
    catch { return reply(res, 500, { error: 'Could not read local demo data' }); }
  }
  if (url.pathname === '/api/state' && req.method === 'POST') {
    try {
      const payload = await readBody(req);
      const state = payload && payload.users && payload.areas && payload.shifts && payload.tasks && payload.handovers ? payload : payload.state;
      if (!state || !Array.isArray(state.users) || !Array.isArray(state.areas) || !Array.isArray(state.shifts) || !Array.isArray(state.tasks) || !Array.isArray(state.handovers)) return reply(res, 400, { error: 'Invalid demo state' });
      fs.writeFileSync(dataPath, JSON.stringify(state, null, 2), 'utf8');
      return reply(res, 200, { ok: true });
    } catch (error) { return reply(res, 400, { error: error.message || 'Could not save demo data' }); }
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return reply(res, 405, { error: 'Method not allowed' });
  let requested;
  try { requested = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname); }
  catch { return reply(res, 400, { error: 'Bad path' }); }
  const file = path.resolve(root, '.' + requested);
  if (!file.startsWith(root + path.sep) || file === dataPath) return reply(res, 403, { error: 'Forbidden' });
  fs.readFile(file, (error, content) => {
    if (error) return reply(res, 404, { error: 'Not found' });
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : content);
  });
});

server.listen(port, '127.0.0.1', () => console.log(`ShiftBridge demo available at http://127.0.0.1:${port}`));
