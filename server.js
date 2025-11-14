#!/usr/bin/env node

/**
 * Simple HTTP server for testing extensionless URLs locally
 * Usage: node server.js [port]
 * Default port: 3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.xml': 'application/xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0]; // Remove query string
    
    // Handle root
    if (urlPath === '/') {
        urlPath = '/index.html';
    }
    
    // Try to serve file as-is first
    let filePath = path.join(__dirname, urlPath);
    
    // If no extension and file doesn't exist, try adding .html
    if (!path.extname(urlPath) && !fs.existsSync(filePath)) {
        if (fs.existsSync(filePath + '.html')) {
            filePath = filePath + '.html';
            urlPath = urlPath + '.html';
        }
    }
    
    // Try to read the file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found, serve 404
                fs.readFile(path.join(__dirname, '404.html'), (err404, content404) => {
                    if (err404) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content404, 'utf-8');
                    }
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end('Server Error: ' + err.code);
            }
        } else {
            // Success - determine content type
            const ext = path.extname(filePath);
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}/`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`✨ Extensionless URLs enabled!\n`);
    console.log(`   Try: http://localhost:${PORT}/about`);
    console.log(`   Try: http://localhost:${PORT}/contact`);
    console.log(`\nPress Ctrl+C to stop the server\n`);
});
