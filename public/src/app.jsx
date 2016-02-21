"use strict";

// React をロード
import React from 'react';
import AppStore from './stores/AppStore'
import DisplayingQuestion from './components/DisplayingQuestion.jsx'
import DisplayingAnswerOption from './components/DisplayingAnswerOption.jsx'
import SocketAPIAction from './actions/SocketAPIAction'
import LoginActions from './actions/LoginActions'

var sapiAction = new SocketAPIAction();
var loginActions = new LoginActions();

let style = {
  divStyle: {
    width: '100%',
    height: '100%'
  }
};
// このアプリケーションのメインとなる App クラス
class App extends React.Component {
  constructor() {
    super();
    this.state = AppStore.getAllData();
    this._onUpdate = this._onUpdate.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    AppStore.addChangeListener(this._onUpdate);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this._onUpdate);
  }

  _onUpdate() {
    this.setState(AppStore.getAllData());
  }

  changeText(e) {
    loginActions.inputUserID(e.target.value);
  }

  login() {
    sapiAction.login(this.state.userID, this.refs.inputPass.getDOMNode().value);
  }

  render() {
    if (!this.state.isLogin) {
      let alertComment = '';
      //   if (this.state.userID != '') {
      //     alertComment = 'passが違うよ';
      //   }
      return (
        <div className='loginArea'>
                  <div>userID<input type='text' value={this.state.userID} onChange={this.changeText} /></div>
                  <div>pass<input type="text" ref='inputPass'/></div>
                  <div><button onClick={this.login}>login</button></div>
                  <span>{alertComment}</span>
              </div>
        );
    } else {
      let answerOptions = '';
      if (this.state.isDisplayedOptions) {
        let pushedFunction = sapiAction.sendAnswer(this.state.userID, this.state.questionNumber);
        answerOptions = this.state.answerOptions.map(element => {
          return (
            <DisplayingAnswerOption answerOption={element} choosedOption={this.state.choosedAnswerOption} pushedFunction={pushedFunction}/>
            );
        });
      }

      if (this.state.isDisplayedQuestion) {
        return (
          <div style={style.divStyle}>
                    <DisplayingQuestion questionSentence={this.state.questionSentence}/>
                    <div className='choosedOptions'>
                        {answerOptions}
                    </div>
                </div>
          );
      } else {
        return (
          <div className='initArea'>
            問題準備中・・・・・・
                </div>
          );
      }

    }

  }
}

// app クラスを描画
React.render(
  <App />,
  document.getElementById('app')
);
