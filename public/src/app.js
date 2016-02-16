var React = require('react');
var socketIO = require('socket.io-client');
var socketConnection = socketIO.connect(`${location.protocol}//${location.host}`);

var CountupApp = require('./components/countupApp.react');
console.log('debug');
React.render(
  <CountupApp socket={socketConnection}/>,
  document.getElementById('app')
);
