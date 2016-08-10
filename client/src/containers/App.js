import React from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { connect } from 'react-redux';
import {fetchBooks} from '../actions/booksActions';
import {fetchCurrentUser} from '../actions/userActions';

injectTapEventPlugin();


@connect(null, {fetchBooks, fetchCurrentUser})
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.props.fetchBooks();
  }

  ComponentDidMount() {
    this.props.fetchCurrentUser();
  }


  handleClick() {
    this.props.fetchBooks();
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        {this.props.children}
      </MuiThemeProvider>
    );
  }
}
