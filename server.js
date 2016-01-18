var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Server started');
});
var io = require('socket.io').listen(server);

app.use(express.static('public'));

io.on('connection', function(socket) {
   console.log("User connected");
   socket.on('move', function(data) {
      console.log("move: " + data.senderKey);
      io.emit('move', data);
   });
   socket.on('moveStart', function(data) {
      console.log("moveStart: " + data.senderKey);
      io.emit('moveStart', data);
   });
   socket.on('moveEnd', function(data) {
      console.log("moveEnd");
      io.emit('moveEnd', data);
   });
});
