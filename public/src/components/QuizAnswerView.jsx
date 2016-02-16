var React = require('react');

var QuizAnswerView = React.createClass({
  _answer() {
    this.props.answerFunc();
    console.log('test');
  },
  render() {
    return (
      <div>
                // <button onClick={this._answer}>回答</button>
                </div>
      );
  }
});

module.exports = QuizAnswerView;
