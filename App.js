const http = require('http');
const url = require('url');
const mysql = require('mysql');

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',       // Use your password
  database: 'react_app' // Use your DB name
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight check
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === 'GET' && parsedUrl.pathname === '/users') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        res.writeHead(500);
        return res.end(JSON.stringify({ error: 'Database error' }));
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(results));
    });
  }

  if (req.method === 'POST' && parsedUrl.pathname === '/add-user') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });

    req.on('end', () => {
      const data = JSON.parse(body);
      const { name, email } = data;

      db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], err => {
        if (err) {
          res.writeHead(500);
          return res.end(JSON.stringify({ error: 'Failed to add user' }));
        }
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'User added' }));
      });
    });
  } else if (req.method !== 'GET' && req.method !== 'POST') {
    res.writeHead(405);
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
