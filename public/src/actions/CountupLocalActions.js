var AppDispatcher = require('../dispatcher/AppDispatcher'),
  CountupConstants = require('../constants/CountupConstants'),
  CountupAPIUtils = require('../apiutils/CountupAPIUtils');

module.exports = {
  reload: function() {
    AppDispatcher.dispatch({
      actionType: CountupConstants.RELOAD
    });
    CountupAPIUtils.reload();
  },
  countup: function() {
    AppDispatcher.dispatch({
      actionType: CountupConstants.COUNTUP
    });
    CountupAPIUtils.countup();
  },
  reset: function() {
    AppDispatcher.dispatch({
      actionType: CountupConstants.RESET
    });
    CountupAPIUtils.reset();
  }
};
