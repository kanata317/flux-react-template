import Express from 'express';
import Http from 'http';
import SocketIO from 'socket.io';
import Bingo from './models/Bingo';
const app = Express();
let port = process.env.PORT || 5000;
console.log('port:' + port);
app.set('port', (port));
app.use(Express.static(__dirname + '/public'));
const http = Http.Server(app);

const io = SocketIO(http);
app.set('socket.io', io);

let socketModule = Bingo(app);


// start server
http.listen(app.get('port'), function() {
  console.log('server start - port:' + app.get('port'));
});
