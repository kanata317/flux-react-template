var express = require('express'),
  mongoose = require('mongoose');

var app = express();

app.set('port', (process.env.PORT || 5000));
mongoose.connect(process.env.MONGOLAB_URI);

app.use(express.static(__dirname + '/public'));

var counter = require('./routes/counter');
app.get('/counter', counter.get);
app.post('/counter', counter.post);
app.delete('/counter', counter.delete);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
