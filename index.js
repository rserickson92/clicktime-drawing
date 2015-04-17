var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http);
app.use("/javascripts", express.static(__dirname + '/javascripts'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
