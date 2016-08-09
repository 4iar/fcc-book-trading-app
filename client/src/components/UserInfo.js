import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';

import {API_USER_INFO_ENDPOINT} from '../constants/endpoints';

export default class userInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      id: props.id,
      user: null
    };

    this.fetchUserInfo();
  }

  fetchUserInfo() {
    axios.get(API_USER_INFO_ENDPOINT + this.state.id)
      .then((response) => {
        console.log(response);
        this.setState({
          user: response.data.user
        });
      })
  }

  handleClose = () => {
    this.setState({open: false});
    this.props.resetUserInfo();
  };

  render() {
    return (
      <div>
        <Dialog
          title="User info"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this)}
        >
          {this.state.user &&
          <div>
            <h5>City</h5>
            <h3>{this.state.user.city}</h3>
            <br />

            <h5>Country</h5>
            <h3>{this.state.user.country}</h3>
            <br />

            <h5>Other info</h5>
            <h3>{this.state.user.otherInfo}</h3>
          </div>
          }
        </Dialog>
      </div>
    );
  }
}
