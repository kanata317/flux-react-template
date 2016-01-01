var CountupAPIActions = require('../actions/CountupAPIActions');

module.exports = {
  reload: function() {
    $.ajax({
      url: '/counter/',
      type: 'GET'
    }).done(function(result) {
      CountupAPIActions.apisynced(result.count);
    }).fail(function(result) {
      console.log(result);
    });
  },
  countup: function() {
    $.ajax({
      url: '/counter/',
      type: 'POST'
    }).done(function(result) {
      CountupAPIActions.apisynced(result.count);
    }).fail(function(result) {
      console.log(result);
    });
  },
  reset: function() {
    $.ajax({
      url: '/counter/',
      type: 'DELETE'
    }).done(function(result) {
      CountupAPIActions.apisynced(result.count);
    }).fail(function(result) {
      console.log(result);
    });
  }
};
