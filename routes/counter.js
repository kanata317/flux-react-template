// This route handles singleton resource counter.

var Counter = require('../models/counter');

// create document if not exists.
Counter.findOne({}, function(error, result) {
  if (result === null) {
    var counter = new Counter({
      count: 0
    });
    counter.save(function(error, result) {});
  }
});

// main proccesses.
module.exports = {
  get: function(request, response) {
    Counter.findOne({}, function(error, result) {
      response.json({
        id: result['_id'],
        count: result['count']
      });
    });
  },
  post: function(request, response) {
    Counter.findOne({}, function(error, result) {
      var counter = result;
      counter.count += 1;
      counter.save(function(error, result) {
        response.json({
          id: result['_id'],
          count: result['count']
        });
      });
    });
  },
  delete: function(request, response) {
    Counter.findOne({}, function(error, result) {
      var counter = result;
      counter.count = 0;
      counter.save(function(error, result) {
        response.json({
          id: result['_id'],
          count: result['count']
        });
      });
    });
  }
};
