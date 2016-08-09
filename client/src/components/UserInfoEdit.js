import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {connect} from 'react-redux';
import axios from 'axios';

import {API_USER_INFO_ENDPOINT} from '../constants/endpoints';

import {promptLogin} from '../actions/userActions';
import {sendNotification} from '../actions/notificationActions';


function getState(state) {
  return {
    id: state.user.id
  };
}

@connect(getState, {sendNotification, promptLogin})
export default class UserInfoEdit extends React.Component {
  constructor(props) {
    super(props);

    this.newInfo = {}

    this.state = {
      open: false,
      waiting: true,
      user: {}
    };
  }

  componentWillMount() {
    this.getInitialData();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.showUserInfoEdit) {
      this.handleOpen();
    }
  }

  getInitialData() {
    axios.get(API_USER_INFO_ENDPOINT + this.props.id)
      .then((response) => {
        if (response.data.message === 'not logged in') {
          this.props.promptLogin();
          return;
        }

        this.newInfo = response.data.user;
        this.setState({
          user: response.data.user,
          waiting: false
        });
      })
  }

  handleOpen = () => {
    this.getInitialData();
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
    this.props.handleUserInfoEditClose();
  };

  handleChange(field, e) {
    this.newInfo[field] = e.target.value;
  }

  handleSubmit() {
    this.setState({
      waiting: true
    })

    axios.post(API_USER_INFO_ENDPOINT + this.props.id, this.newInfo)
      .then((response) => {
        this.setState({
          waiting: false
        });

        this.props.sendNotification(response.data.status, response.data.message);
        this.handleClose();
      })
  }

  render() {
    const actions = [
      <FlatButton
        label="Submit"
        primary={true}
        disabled={this.state.waiting}
        keyboardFocused={true}
        onTouchTap={this.handleSubmit.bind(this)}
      />,
    ];

    return (


      <div>
        <Dialog
          title="Edit public info"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this)}
        >
          <TextField
            disabled={this.state.waiting}
            fullWidth={true}
            defaultValue={this.state.user.city}
            floatingLabelText="City"
            floatingLabelFixed={true}
            onChange={this.handleChange.bind(this, 'city')}
          /><br />

          <TextField
            disabled={this.state.waiting}
            fullWidth={true}
            defaultValue={this.state.user.country}
            floatingLabelText="Country"
            floatingLabelFixed={true}
            onChange={this.handleChange.bind(this, 'country')}
          /><br />

          <TextField
            disabled={this.state.waiting}
            fullWidth={true}
            defaultValue={this.state.user.otherInfo}
            floatingLabelText="Additional info"
            floatingLabelFixed={true}
            onChange={this.handleChange.bind(this, 'otherInfo')}
            multiLine={true}
            rows={3}
          /><br />

        </Dialog>
      </div>
    );
  }
}
