import jsonServer from 'json-server';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({
  static: false,
});

server.use(jsonServer.bodyParser);

server.use(middlewares);

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

server.post('/check-password', async (req, res) => {
  const { password, hash } = req.body;

  try {
    const response = await fetch('https://www.toptal.com/developers/bcrypt/api/check-password.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `password=${encodeURIComponent(password)}&hash=${encodeURIComponent(hash)}`,
    });

    const data = await response.json();
    res.json({ ok: data.ok });
  } catch (error) {
    console.error('Error checking password:', error);
    res.status(500).json({ error: 'Failed to check password' });
  }
});

server.use(router);

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
