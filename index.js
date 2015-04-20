//load node libraries
var express = require('express'),
fs = require('fs'),
app = express(),
http = require('http').Server(app),
io = require('socket.io')(http);

//configure css/js folders
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

//load index.html
app.get('/', function(req, res){
  res.sendFile('index.html', {root: __dirname});
});

/* when a user connects:
 * -assign them a color
 * -load pre-existing drawings
 * -add event handler for when a user draws
 */
var canvasImageURL;
io.on('connection', function(socket){
  socket.emit('color-load', selectColor());
  socket.on('draw', function(data) {
    canvasImageURL = data.img;
    socket.broadcast.emit('other-draw', data);
  });
  if(canvasImageURL) {
    socket.emit('drawing-load', canvasImageURL);
  }
});

//logic for loading/selecting colors
var loadColors = function() {
  var data = JSON.parse(fs.readFileSync('colors.json', 'utf-8'));
  return data.colors;
}
colors = loadColors();
selectColor = function() {
  return colors.length > 0 ? colors.shift() : 'black';
};

//start server
var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

