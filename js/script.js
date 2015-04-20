$(function() {
  var socket = io(),
  canvas = document.getElementById('main-canvas'),
  ctx = canvas.getContext('2d'),
  painting = false,
  turnPaintingOff = function() { painting = false; };
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  socket.on('color-load', function(color) {
    console.log(color);
    var origX, origY;
    ctx.strokeStyle = color;
    $('#main-canvas').on('mousedown', function(e) {
      painting = true;
      origX = e.offsetX;
      origY = e.offsetY;
      ctx.beginPath();
      ctx.moveTo(origX, origY);
    }).on('mousemove', function(e) {
      if(painting) {
	ctx.lineTo(e.offsetX, e.offsetY);
	ctx.stroke();
	socket.emit('draw', {
	  color: color,
	  img: canvas.toDataURL(),
	  x1: origX,
	  y1: origY,
	  x2: e.offsetX,
	  y2: e.offsetY
	});
	origX = e.offsetX;
	origY = e.offsetY;
      }
    }).on('mouseup', turnPaintingOff)
    .on('mouseleave', turnPaintingOff);
  }).on('other-draw', function(data) {
    var origColor = ctx.strokeStyle;
    ctx.strokeStyle = data.color;
    ctx.beginPath();
    ctx.moveTo(data.x1, data.y1);
    ctx.lineTo(data.x2, data.y2);
    ctx.stroke();
    ctx.strokeStyle = origColor;
  }).on('drawing-load', function(imgUrl) {
    ctx.beginPath();
    var img = new Image;
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
    };
    img.src = imgUrl;
  });
});
