import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// open the database file
const db = await open({
  filename: 'chat.db',
  driver: sqlite3.Database
});

// create our 'messages' table (you can ignore the 'client_offset' column for now)
await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_ip TEXT,
      content TEXT
  );
`);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

let clientIp = "";
const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  clientIp = req.ip;
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('chat message', async (msg) => {
    let result;
    try {
      // store the message in the database
      result = await db.run('INSERT INTO messages (client_ip,content) values(?,?)', clientIp, msg);
    } catch (e) {
      console.error(e);
      return;
    }
    // include the offset with the message
    io.emit('chat message', clientIp, result.lastID, msg);
  });

  socket.on('history', async () => {
    let result;
    try {
      result = await db.all("select * from messages", (err, rows) => {
        return JSON.stringify(rows);
      });

    } catch (e) {
      console.error(e);
      return;
    }
    // include the offset with the message
    console.log(result);
    io.emit('history', result);
  });

});

server.listen(80, () => {
  console.log('server running at http://localhost:80');
});