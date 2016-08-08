import React from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { connect } from 'react-redux';
import {fetchVenues} from '../actions/venuesActions';

injectTapEventPlugin();


@connect(null, {fetchVenues})
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  
  handleClick() {
    this.props.fetchVenues();
  }
  
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        {this.props.children}
      </MuiThemeProvider>
    );
  }
}
