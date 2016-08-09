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
import {API_BOOK_ACTIONS_ENDPOINT} from '../constants/endpoints';
//import '../styles/addbook.scss';

function getState(state) {
  return {
    userId: state.user.id,
    books: state.books.books
  };
}

@connect(getState, {promptLogin})
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

  handleSubmit(bookId) {
    this.setState({
      waiting: true
    });

    axios.post(API_BOOK_ACTIONS_ENDPOINT, {bookId})
      .then((data) => {
        this.setState({
          waiting: false,
          open: false
        })
        // TODO: handle login status before (on FAB click)
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

  render() {
    const title = {
      requests: 'Trades you have requested',
      propositions: 'Trade propositions from other users'
    }[this.state.view];

    return (
      <div>
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
                  <RaisedButton disabled={this.state.waiting} onClick={this.handleSubmit.bind(this, b.id)} primary={true} label="Add to trade board"/>

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
