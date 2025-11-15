import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { DatabaseSync } from 'node:sqlite';

const __dirname = import.meta.dirname;
const __filename = import.meta.filename;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const db = new DatabaseSync(__dirname + '/chat.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_ip TEXT,
      msg TEXT
  );
`);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  let ip = socket.handshake.address;
  console.log(socket.handshake);
  console.log(socket.id);
  socket.on('chat message', async (msg) => {
    try {
      const insert = db.prepare('INSERT INTO messages (client_ip,msg) VALUES (?, ?)');
      insert.run(ip, msg);
      io.emit('chat message', ip, msg);
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('history', async () => {
    let result;
    try {
      result = db.prepare('select * from messages ORDER BY id');
      io.emit('history', result.all());
    } catch (e) {
      console.error(e);
    }
  });
});

// 在这里 app.listen(3000)将不起作用，因为它创建一个新的 HTTP 服务器。
httpServer.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
