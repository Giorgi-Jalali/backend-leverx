import jsonServer from 'json-server';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({
  static: false,
});

server.use(middlewares);
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

server.post('/check-password', async (req, res) => {
  try {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const { password, hash } = JSON.parse(body);

      const isValid = await bcrypt.compare(password, hash);

      res.json({ ok: isValid });
    });
  } catch (error) {
    console.error('Error verifying password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.use(router);

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});





// import jsonServer from 'json-server';
// import { dirname, join } from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const server = jsonServer.create();
// const router = jsonServer.router(join(__dirname, 'db.json'));
// const middlewares = jsonServer.defaults({
//   static: false,
// });

// server.use(middlewares);

// server.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
//   next();
// });

// server.use(router);

// const PORT = process.env.PORT || 10000;
// server.listen(PORT, '0.0.0.0', () => {
//   console.log(`JSON Server is running on http://localhost:${PORT}`);
// });

