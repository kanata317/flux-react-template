var io = require('socket.io');

module.exports = sio;

function sio(server) {
  var sio = io.listen(server);
  sio.set('transports', ['websocket']);

  sio.sockets.on('connection', function(socket) {
    console.log('connect');
  });
}
