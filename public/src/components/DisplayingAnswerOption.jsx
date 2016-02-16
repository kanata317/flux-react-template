import React from 'react';

let pushedFunction = () => {
  console.log('dummy');
};

export default class DisplayingAnswerOption extends React.Component {
  constructor(props) {
    super(props);
    pushedFunction = this.props.pushedFunction;
    this.state = {
      optionNumber: this.props.answerOption.number
    };

    this.sendChooesedOption = this.sendChooesedOption.bind(this);
  }
  sendChooesedOption() {
    pushedFunction(this.state.optionNumber);
    console.log(this.state.optionNumber);
  }
  render() {
    let buttonColor = '';
    switch (this.props.answerOption.number) {
      case '1':
        buttonColor = 'red';
        break;
      case '2':
        buttonColor = 'yellow';
        break;
      case '3':
        buttonColor = 'green';
        break;
      case '4':
        buttonColor = 'blue';
        break;
    }

    if (this.props.choosedOption != '') {
      return (
        <div>
              <button className={buttonColor} disabled>
                  {this.props.answerOption.number}
                  {this.props.answerOption.answerSentence}
              </button>
          </div>
        );

    } else {
      return (
        <div>
              <button className={buttonColor} onClick={this.sendChooesedOption}>
                  {this.props.answerOption.number}
                  {this.props.answerOption.answerSentence}
              </button>
          </div>
        );
    }
  }
}
