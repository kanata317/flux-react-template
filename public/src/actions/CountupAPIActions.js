var AppDispatcher = require('../dispatcher/AppDispatcher'),
  CountupConstants = require('../constants/CountupConstants');

module.exports = {
  apisynced: function(count) {
    AppDispatcher.dispatch({
      actionType: CountupConstants.APISYNCED,
      count: count
    });
  }
};
