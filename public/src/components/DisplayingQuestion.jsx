import React from 'react';

export default class DisplayingQuestion extends React.Component {
  render() {

    let questionSentence = this.props.questionSentence;
    if (questionSentence == '') {
      questionSentence = '問題準備中・・・・・・';
    }
    return (
      <div>
                {questionSentence}
            </div>
      );
  }
}
