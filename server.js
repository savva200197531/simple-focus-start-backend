const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const mainSocket = require('socket.io');

const io = mainSocket(server);

const users = [];
// let yourId = '';

io.on('connection', (socket) => {
  // socket.on('yourID', (id) => {
  //   yourId = id;
  // });

  socket.on('allUsers', (userId) => {
    if (!userId) return;
    users[userId] = {
      userId,
      socketId: socket.id
    };
    console.log(users);
  });

  socket.on('callUser', (data) => {
    if (users) {
      const from = users[data.from];
      const to = users[data.userToCall];
      io.to(to.socketId)
        .emit(
          'hey',
          {
            signal: data.signalData,
            from: from.socketId,
            userId: from.userId
          }
        );
    }
  });

  socket.on('acceptCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});

server.listen(8000, () => console.log('server is running on port 8000'));
