// React をロード
import React from 'react';

// Message クラス
export default class Message extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <p>
        {this.props.name}
      </p>
      );
  }
}
