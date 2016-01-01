var React = require('react'),
  CountupAppControlPanel = require('./CountupAppControlPanel.react'),
  CountupAppDisplayPanel = require('./CountupAppDisplayPanel.react'),
  CountupLocalActions = require('../actions/CountupLocalActions'),
  CountupStore = require('../stores/CountupStore');

function getStateFromStore() {
  return {
    count: CountupStore.getCount()
  }
}

var CountupApp = React.createClass({
  getInitialState: function() {
    return getStateFromStore();
  },
  componentDidMount: function() {
    CountupStore.addChangeListener(this._onUpdate);
    CountupLocalActions.reload();
  },
  componentWillUnmount: function() {
    CountupStore.removeChangeListener(this._onUpdate);
  },
  render: function() {
    return (
      <div>
                <CountupAppControlPanel />
                <CountupAppDisplayPanel count={this.state.count} />
            </div>
      );
  },
  _onUpdate: function() {
    this.setState(getStateFromStore());
  }
});

module.exports = CountupApp;
