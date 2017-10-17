import React from 'react';
import 'dispatch' from

export default class EssayInput extends React.Component {

  // this is just an example
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div className="EssayInput" contentEditable={true} onInput={this.onInput}>
        {
          this.props.words.map((x, index) => {
            return <Word word={x.name} rules={x.rules} key={index}/>;
          })
        }
      </div>
    );
  }

  onInput() {
    dispatch({
      type: 'ESSAY_CHANGED'
    });
  }

}

class Word extends React.Component {
  render() {
    let rules = this.props.rules.join(" ");
    return <span className={rules}>{`${this.props.word} `}</span>
  }
}
