$(function() {
  var socket = io(),
  canvas = document.getElementById('main-canvas'),
  ctx = canvas.getContext('2d'),
  painting = false,
  turnPaintingOff = function() { painting = false; }

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  $('#main-canvas').on('mousedown', function(e) {
    painting = true;
    ctx.moveTo(e.offsetX, e.offsetY);
  }).on('mousemove', function(e) {
    if(painting) {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }
  }).on('mouseup', turnPaintingOff)
  .on('mouseleave', turnPaintingOff);
});
