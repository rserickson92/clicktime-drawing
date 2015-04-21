$(function() {
  //load socket.io, get/initialize canvas properties
  var socket = io(),
  canvas = document.getElementById('main-canvas'),
  ctx = canvas.getContext('2d'),
  painting = false,
  turnPaintingOff = function() { painting = false; };
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  /* Function to get position of clicks in canvas.
   * Necessary because Firefox doesn't have e.offsetX and e.offsetY.
   */
  var getOffset = function(e, axis) {
    var rect = e.target.getBoundingClientRect(),
    offsetX = e.clientX - rect.left,
    offsetY = e.clientY - rect.top;
    return axis === 'x' ? offsetX : offsetY;
  };

  /* when user connects (is assigned a color):
   * -register drawing event handlers
   * -register event handler for when other users draw
   * -register event handler for when a new user connects
   */
  socket.on('color-load', function(color) {
    var origX, origY;
    ctx.strokeStyle = color;

    //when user clicks, begin drawing
    $('#main-canvas').on('mousedown', function(e) {
      painting = true;
      origX = getOffset(e, 'x');
      origY = getOffset(e, 'y');

    //when user moves mouse, draw
    }).on('mousemove', function(e) {
      if(painting) {
	ctx.beginPath();
	ctx.moveTo(origX, origY);
	ctx.lineTo(getOffset(e, 'x'), getOffset(e, 'y'));
	ctx.stroke();
	socket.emit('draw', {
	  color: color,
	  img: canvas.toDataURL(),
	  x1: origX,
	  y1: origY,
	  x2: getOffset(e, 'x'),
	  y2: getOffset(e, 'y')
	});
	origX = getOffset(e, 'x');
	origY = getOffset(e, 'y');
      }

    //when user lets go of mouse or leaves bounds, stop drawing
    }).on('mouseup', turnPaintingOff)
    .on('mouseleave', turnPaintingOff);

  //when another user draws, update current user's canvas
  }).on('other-draw', function(data) {
    var origColor = ctx.strokeStyle;
    ctx.strokeStyle = data.color;
    ctx.beginPath();
    ctx.moveTo(data.x1, data.y1);
    ctx.lineTo(data.x2, data.y2);
    ctx.stroke();
    ctx.strokeStyle = origColor;

  //if there are drawings already, load them
  }).on('drawing-load', function(imgUrl) {
    ctx.beginPath();
    var img = new Image;
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
    };
    img.src = imgUrl;

  }).on('clear-canvas', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
});
