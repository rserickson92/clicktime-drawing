var express = require('express'),
  fs = require('fs'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http);
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function(req, res){
  res.sendFile('index.html', {root: __dirname});
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('color-load', selectColor());
});

var loadColors = function() {
  var data = JSON.parse(fs.readFileSync('colors.json', 'utf-8'));
  return data.colors;
}

colors = loadColors();
selectColor = function() {
  return colors.length > 0 ? colors.pop() : 'black';
};

http.listen(3000, function(){
  console.log('listening on *:3000');
});

