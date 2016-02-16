"use strict";

// React をロード
import React from 'react';
import socketIO from 'socket.io-client'

let socket = socketIO.connect(`${location.protocol}//${location.host}`);
socket.on('connect', () => {
  console.info('connecting.....')
});
// このアプリケーションのメインとなる App クラス
class Host extends React.Component {
  constructor() {
    super();
    this.recieveAnswer = this.recieveAnswer.bind(this);
  }

  sendQuestion() {
    socket.emit('control', {
      actionType: 'sendQuestion'
    });
  }

  init() {
    socket.emit('control', {
      actionType: 'init'
    });
  }

  start() {
    socket.emit('control', {
      actionType: 'start'
    });
  }

  end() {
    socket.emit('control', {
      actionType: 'end'
    });
  }

  sendRanking() {
    socket.emit('control', {
      actionType: 'sendRanking'
    });
  }

  sendChoosedResults() {
    socket.emit('control', {
      actionType: 'sendChoosedResults'
    });
  }

  recieveAnswer() {
    socket.emit('control', {
      actionType: 'recieveAnswer',
      questionAnswer: {
        answerOption: String(this.refs.answerOption.getDOMNode().value)
      }
    });
  }

  render() {
    return (
      <div>
            <div>
                <button onClick={this.init}>初期化</button>
            </div>
            <div>
                <button onClick={this.sendQuestion}>問題送信</button>
            </div>
            <div>
                <button onClick={this.start}>回答開始</button>
            </div>
            <div>
                <button onClick={this.end}>回答終了</button>
            </div>
            <div>
                <button onClick={this.sendChoosedResults}>回答結果出力</button>
            </div>
            <div>
                <input ref='answerOption' type='text'></input>
                <button onClick={this.recieveAnswer}>回答送信</button>
            </div>
            <div>
                <button onClick={this.sendRanking}>ランキング出力</button>
            </div>
        </div>
      );
  }
}

// app クラスを描画
React.render(
  <Host />,
  document.getElementById('app')
);
