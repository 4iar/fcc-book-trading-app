import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';

import {promptLogin} from '../actions/userActions';


@connect(null, {promptLogin})
export default class NavBar extends React.Component {
  render() {
    return (
      <AppBar
        title="Nightlife Coordinator"
        iconElementLeft={<div></div>}
        iconElementRight={<FlatButton onClick={this.props.promptLogin.bind(this)} label="Login" />}
      />
    );
  }
}
