import React from 'react';
import EssayInput from './EssayInput';

export default class App extends React.Component {

  render() {

    let words = "Hello this is a test test test".split(" ");
    words = words.map((word) => {
      return { name: word, rules: ["frequent", "too_close"] };
    });
    return <EssayInput words={words}/>
  }

}
