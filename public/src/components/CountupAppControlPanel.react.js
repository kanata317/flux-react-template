var React = require('react'),
  CountupLocalActions = require('../actions/CountupLocalActions');

var CountupAppControlPanel = React.createClass({
  render: function() {
    return (
      <div>
                <button onClick={this._onCountup}>Countup</button>
                <button onClick={this._onReset}>Reset</button>
            </div>
      );
  },
  _onCountup: function() {
    CountupLocalActions.countup();
  },
  _onReset: function() {
    CountupLocalActions.reset();
  }
});

module.exports = CountupAppControlPanel;
