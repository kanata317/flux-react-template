import socketIO from 'socket.io-client'
import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

let socket = {};
class SocketAPIAction {
  constructor() {
    socket = socketIO.connect(`${location.protocol}//${location.host}`);
    socket.on('connect', () => {
      console.info('connecting.....')
    });
    socket.on('server', recieveData => {
      console.log('recieve');
      AppDispatcher.dispatch({
        actionType: recieveData.actionType,
        deliveredData: recieveData.deliveredData
      });
    });
  }

  login(userID, pass) {
    socket.emit('answer', {
      actionType: 'login',
      authenticationData: {
        userID: userID,
        pass: pass
      }
    });
  }

  sendAnswer(userID, questionNumber, choosedOption) {
    let curryFuction = (choosedOption) => {
      socket.emit('answer', {
        actionType: 'storeChooesedOption',
        storedData: {
          userID: userID,
          questionNumber: questionNumber,
          choosedOption: choosedOption
        }
      });
      AppDispatcher.dispatch({
        actionType: AppConstants.DISPLAY_CHOOSED_OPTION,
        deliveredData: {
          choosedOption: choosedOption
        }
      });
    };
    if (choosedOption == undefined) {
      return curryFuction;
    } else {
      curryFuction(choosedOption);
    }

  }
}

module.exports = SocketAPIAction;
