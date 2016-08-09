import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';

import {promptLogin} from '../actions/userActions';
import UserInfoEdit from '../components/UserInfoEdit';


@connect(null, {promptLogin})
export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserInfoEdit: false
    };
  }

  handleUserInfoEditOpen() {
    this.setState({
      showUserInfoEdit: true
    });
  }

  render() {
    return (
      <div>
        <UserInfoEdit
          showUserInfoEdit={this.state.showUserInfoEdit}
          handleUserInfoEditClose={this.setState.bind(this, {showUserInfoEdit: false})}
        />
      <AppBar
        title="BookTrade"
        iconElementLeft={<div></div>}
        iconElementRight={
          <FlatButton
            onClick={this.handleUserInfoEditOpen.bind(this)}
            label="User"
          />
        }
      />
        </div>
    );
  }
}
