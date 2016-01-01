var assign = require('object-assign'),
  EventEmitter = require('events').EventEmitter,
  AppDispatcher = require('../dispatcher/AppDispatcher'),
  CountupConstants = require('../constants/CountupConstants');

var CHANGE_EVENT = 'change';

var _count = 0;

var CountupStore = assign({}, EventEmitter.prototype, {
  getCount: function() {
    return _count;
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  }
});

CountupStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case CountupConstants.COUNTUP:
      _count += 1;
      CountupStore.emitChange();
      break;
    case CountupConstants.RESET:
      _count = 0;
      CountupStore.emitChange();
      break;
    case CountupConstants.APISYNCED:
      _count = action.count;
      CountupStore.emitChange();
      break;
    default:
  // no op.
  }
});

module.exports = CountupStore;
