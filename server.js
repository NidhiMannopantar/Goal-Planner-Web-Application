// server.js
const http = require('http');
const url = require('url');
const db = require('./db');

const PORT = 3001;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Set CORS headers so React frontend can fetch data
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (parsedUrl.pathname === '/tasks' && req.method === 'GET') {
        db.query('SELECT * FROM tasks', (err, results) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'DB query failed' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
