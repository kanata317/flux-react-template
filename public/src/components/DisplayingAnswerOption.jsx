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
    let optionColor = 'option' + this.props.answerOption.number;

    if (this.props.choosedOption != '') {
      let choosedOptionColor = '';
      if (this.props.choosedOption == this.props.answerOption.number) {
        choosedOptionColor = 'choosedOption';
      }
      return (
        <div className={choosedOptionColor} disabled>
              <span className={optionColor}>{this.props.answerOption.number}</span>
              <span className='optionText'>{this.props.answerOption.answerSentence}</span>
          </div>
        );

    } else {
      return (
        <div onClick={this.sendChooesedOption}>
                <span className={optionColor}>{this.props.answerOption.number}</span>
                <span className='optionText'>{this.props.answerOption.answerSentence}</span>
            </div>
        );
    }
  }
}
