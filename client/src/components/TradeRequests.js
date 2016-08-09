import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText, CardMedia} from 'material-ui/Card';
import Badge from 'material-ui/Badge';
import NavigationArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import axios from 'axios';
import {connect} from 'react-redux';

import {promptLogin} from '../actions/userActions';
import {sendNotification} from '../actions/notificationActions';
import {API_BOOK_ACTIONS_ENDPOINT} from '../constants/endpoints';
import UserInfo from '../components/UserInfo';
//import '../styles/addbook.scss';

function getState(state) {
  return {
    userId: state.user.id,
    books: state.books.books
  };
}

@connect(getState, {promptLogin, sendNotification})
export default class TradeRequests extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;

    this.state = {
      error: '',
      open: false,
      waiting: false,
      userId: this.props.userId,
      books: this.props.books,
      selection: '',
      requests: this.props.books.filter((b) => {
        return b.tradingWith === this.props.userId;
      }),
      propositions: this.props.books.filter((b) => {
        return b.addedBy === this.props.userId && b.tradeStatus
      })
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      books: newProps.books,
      userId: newProps.userId,
      requests: newProps.books.filter((b) => {
        return b.tradingWith === newProps.userId;
      }),
      propositions: newProps.books.filter((b) => {
        return b.addedBy === newProps.userId && b.tradeStatus
      })
    });
  }

  handleSubmit(bookId, action) {
    this.setState({
      waiting: true
    });

    axios.post(API_BOOK_ACTIONS_ENDPOINT + bookId, {bookId, action})
      .then((data) => {
        this.setState({
          waiting: false,
          open: false,
        })
        this.props.sendNotification(data.data.status, data.data.message);
        if (data.data.status === 'error' && data.data.message === 'not logged in') {
          this.props.promptLogin()
        }
      })
  }

  handleOpen(selection) {
    this.setState({
      view: selection,
      selection,
      open: true
    })
  }

  handleClose = () => {
    this.setState({open: false});
  };

  showUserInfo(id) {
    this.setState({
      showUserInfo: id
    });
  }

  render() {
    const title = {
      requests: 'Trades you have requested',
      propositions: 'Trade propositions from other users'
    }[this.state.view];

    return (
      <div>
        {this.state.showUserInfo &&
        <UserInfo id={this.state.showUserInfo} resetUserInfo={this.setState.bind(this, ({showUserInfo: ''}))} />
        }

        <Dialog
          title={title}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          disabled={this.state.waiting}
        >
          <br/>
          {this.state[this.state.selection] ? this.state[this.state.selection].map((b) => {
            let buttonText = '';
            let buttonDisabled = false;
            let buttonStyle = '';
            let action = '';

            if (b.tradeStatus === 'approved') {
              buttonText = 'Trade Approved'
              buttonDisabled = true;
            } else if (b.tradeStatus === 'proposed') {
              if (this.state.selection === 'requests') {
                buttonText = 'Unpropose'
                buttonStyle = 'secondary'
                action = 'unpropose';
              } else if (this.state.selection === 'propositions') {
                buttonText = 'Reject'
                buttonStyle = 'secondary';
                action = 'reject';
              }
            }

            return (
              <Card className="search-result">
                <CardHeader
                  title={b.metadata.title}
                  subtitle={b.metadata.authors ? "(" + b.metadata.authors[0] + ")" : ''}
                  actAsExpander={true}
                  showExpandableButton={true}
                />

                <CardMedia className="image" expandable={true}>
                  <img src={b.metadata.thumbnail} />
                </CardMedia>

                <CardText expandable={true}>
                  {b.metadata.description ? b.metadata.description.replace(/<(?:.|\n)*?>/gm, '') : ''}
                </CardText>

                <CardActions>
                  <RaisedButton disabled={this.state.waiting || buttonDisabled}
                                onClick={this.handleSubmit.bind(this, b.id, action)}
                                primary={buttonStyle === 'primary' ? true : false}
                                secondary={buttonStyle === 'secondary' ? true : false}
                                label={buttonText}
                  />
                  {action === 'reject' && <RaisedButton disabled={this.state.waiting || buttonDisabled}
                                onClick={this.handleSubmit.bind(this, b.id, 'reject')}
                                secondary={true}
                                label='Approve'
                  />}
                  <RaisedButton onClick={this.showUserInfo.bind(this, this.state.selection === 'requests' ? b.addedBy : b.tradingWith)}
                                secondary={true}
                                label='User info'
                  />
                </CardActions>
              </Card>
            )
          }) : null}

        </Dialog>

        <div>
          <Badge
            badgeContent={this.state.requests ? this.state.requests.length : 0}
            secondary={true}
            badgeStyle={{top: 12, right: 12}}
          >
            <IconButton tooltip="Trade requests" onClick={this.handleOpen.bind(this, "requests")}>
              <NavigationArrowForward />
            </IconButton>
          </Badge>

          <Badge
            badgeContent={this.state.propositions ? this.state.propositions.length : 0}
            primary={true}
            badgeStyle={{top: 12, right: 12}}
          >
            <IconButton tooltip="Trade propositions" onClick={this.handleOpen.bind(this, "propositions")}>
              <NavigationArrowBack />
            </IconButton>
          </Badge>
        </div>
      </div>
    );
  }
}
