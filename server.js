const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});



io.on('connection', (socket) => {

    console.log('user connection')
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('hello', 'world');
        io.emit('chat message', msg);
        socket.broadcast.emit('hi');
    });

    io.on('connection', (socket) => {
        socket.on('chat message', async (msg) => {
          let result;
          try {
            // store the message in the database
            result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
          } catch (e) {
            // TODO handle the failure
            return;
          }
          // include the offset with the message
          io.emit('chat message', msg, result.lastID);
        });
        
        
      });
        
});


server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});

