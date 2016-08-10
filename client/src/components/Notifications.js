import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import {connect} from 'react-redux';

function getState(state) {
  return {
    notification: state.notification.newest,
    count: state.notification.count
  };
}

@connect(getState)
export default class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autoHideDuration: 4000,
      message: this.props.notification,
      open: false,
      count: 0
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      open: true,
      message: newProps.notification,
      count: newProps.count
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    return (
      <div>
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={this.state.autoHideDuration}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}
