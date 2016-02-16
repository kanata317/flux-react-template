var React = require('react'),
  CountupAppControlPanel = require('./CountupAppControlPanel.react'),
  CountupAppDisplayPanel = require('./CountupAppDisplayPanel.react'),
  CountupLocalActions = require('../actions/CountupLocalActions'),
  CountupStore = require('../stores/CountupStore'),
  QuizAnswerView = require('./QuizAnswerView.react'),
  QuizSocketActions = require('../actions/QuizSocketActions')
socketAction = {};
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
    socketAction = QuizSocketActions(this.props.socket);
  },
  componentWillUnmount: function() {
    CountupStore.removeChangeListener(this._onUpdate);
  },
  render: function() {
    return (
      <div>
                <CountupAppControlPanel />
                <CountupAppDisplayPanel count={this.state.count} />
                <QuizAnswerView answerFunc={this._emitAnswer} />
            </div>
      );
  },
  _onUpdate: function() {
    this.setState(getStateFromStore());
  },
  _emitAnswer: function() {
    socketAction.answer();
  }

});

module.exports = CountupApp;
