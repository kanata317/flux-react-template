import AppLogic from './AppLogic';

const appLogic = new AppLogic();

module.exports = function(app) {
  const io = app.get('socket.io');
  io.on('connection', socket => {
    console.log('connect');

    const emitFunction = (sendData) => {
      socket.emit('server', sendData);
    };

    const emitToParticularFunction = (sendData) => {
      io.to(socket.id).emit('server', sendData);
    }

    const broadcastFunction = (sendData) => {
      console.log('broadcast');
      socket.broadcast.emit('server', sendData);
    };

    socket.on('control', (recieveData) => {
      switch (recieveData.actionType) {
        case 'sendQuestion':
          appLogic.sendQuestion(broadcastFunction);
          break;
        case 'init':
          appLogic.init();
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
          appLogic.recieveAnswer(recieveData.questionAnswer);
          break;
        default:

      }
      console.log('control');
    })

    socket.on('answer', (recieveData) => {
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
