const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/example.html');
});


io.on('connection', (socket) => {  
  let channel = "";
  let pseudo = "";
  socket.on('new_co', data => {
    socket.join(data.channel);
    io.to(data.channel).emit('new_message', 'new user connected : '+data.pseudo);
    channel = data.channel;
    pseudo = data.pseudo;
  });

  socket.on('is_typing', data => {
      io.to(channel).emit('is_typing', data);
  });

  socket.on('chat_message', data => {
    data =  pseudo+" : " + data
    socket.to(channel).emit('new_message', data);
  });
});

//https://socket.io/get-started/chat#getting-this-example
server.listen(3000, () => {
  console.log('listening on *:3000');
});
