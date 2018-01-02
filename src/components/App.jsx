import React from 'react';
import EssayInput from './EssayInput';

export default class App extends React.Component {

  render() {
    return <EssayInput />
  }

}

// TODO: learn redux
// import { connect } from 'react-redux';
// let mapStateToProps = state => ({
//   text: state.text
// });
//
// let mapDispatchToProps = dispatch => ({
//   changeText: (text) => dispatch({
//     type: 'TEXT_CHANGED',
//     text,
//   })
// });
//
// export default connect(
// 	mapStateToProps, mapDispatchToProps
// )(App);
