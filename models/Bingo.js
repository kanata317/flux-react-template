'use strict';

var _AppLogic = require('./AppLogic');

var _AppLogic2 = _interopRequireDefault(_AppLogic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appLogic = new _AppLogic2.default();

module.exports = function (app) {
  var io = app.get('socket.io');
  io.on('connection', function (socket) {
    console.log('connect');

    var emitFunction = function emitFunction(sendData) {
      socket.emit('server', sendData);
    };

    var emitToParticularFunction = function emitToParticularFunction(sendData) {
      io.to(socket.id).emit('server', sendData);
    };

    var broadcastFunction = function broadcastFunction(sendData) {
      console.log('broadcast');
      socket.broadcast.emit('server', sendData);
    };

    socket.on('control', function (recieveData) {
      switch (recieveData.actionType) {
        case 'sendQuestion':
          appLogic.sendQuestion(broadcastFunction);
          break;
        case 'init':
          appLogic.init();
          break;
        case 'start':
          appLogic.start(broadcastFunction);
          break;
        case 'end':
          appLogic.end(broadcastFunction);
          break;
        case 'sendRanking':
          appLogic.sendRanking(broadcastFunction);
          break;
        case 'sendChoosedResults':
          appLogic.sendChoosedResults(broadcastFunction);
          break;
        case 'recieveAnswer':
          appLogic.recieveAnswer(recieveData.questionAnswer, broadcastFunction);
          break;
        default:

      }
      console.log('control');
    });

    socket.on('answer', function (recieveData) {
      console.log('answer');
      switch (recieveData.actionType) {
        case 'login':
          appLogic.login(recieveData.authenticationData, emitToParticularFunction);
          break;
        case 'storeChooesedOption':
          appLogic.storeChooesedOption(recieveData.storedData);
          break;
        default:

      }
    });
  });
};