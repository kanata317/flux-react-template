'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _Bingo = require('./models/Bingo');

var _Bingo2 = _interopRequireDefault(_Bingo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.set('port', process.env.PORT || 5000);

app.use(_express2.default.static(__dirname + '/public'));
var http = _http2.default.Server(app);

var io = (0, _socket2.default)(http);
app.set('socket.io', io);

var socketModule = (0, _Bingo2.default)(app);

// start server
http.listen(process.env.PORT, function () {
  console.log('server start - port:' + process.env.PORT);
});