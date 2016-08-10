import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText, CardMedia} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import books from 'google-books-search';
import axios from 'axios';
import {connect} from 'react-redux';

import {promptLogin} from '../actions/userActions';
import {sendNotification} from '../actions/notificationActions';
import {fetchBooks} from '../actions/booksActions';
import {API_BOOK_ACTIONS_ENDPOINT} from '../constants/endpoints';
import '../styles/addbook.scss';


@connect(null, {promptLogin, sendNotification, fetchBooks})
export default class AddStock extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
    this.bookToAdd = '';

    this.state = {
      error: '',
      open: false,
      books: [],
      waiting: false
    };
  }

  componentDidMount() {
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
        this.props.sendNotification(data.data.status, data.data.message);
        // TODO: handle login status before (on FAB click)
        if (data.data.status === 'error' && data.data.message === 'not logged in') {
          this.props.promptLogin()
        } else {
          this.props.fetchBooks();
        }
      })
  }

  handleChange(e) {
    this.bookToAdd = e.target.value;
    // remove the error message when the stock is changed
    books.search(e.target.value, (error, result) => {
      this.setState({
        books: result
      });
    });
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    return (
      <div>
        <Dialog
          title="Add a new book"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          disabled={this.state.waiting}
        >
          <TextField
            className="input"
            onChange={this.handleChange.bind(this)}
            floatingLabelText="Book title"
            errorText={this.state.error}
            fullWidth={true}
          />

          <br/>
          {this.state.books ? this.state.books.map((b) => {
            return (
              <Card className="search-result">
                <CardHeader
                  title={b.title}
                  subtitle={b.authors ? "(" + b.authors[0] + ")" : ''}
                  actAsExpander={true}
                  showExpandableButton={true}
                />

                <CardMedia className="image" expandable={true}>
                  <img src={b.thumbnail} />
                </CardMedia>

                <CardText expandable={true}>
                  {b.description ? b.description.replace(/<(?:.|\n)*?>/gm, '') : ''}
                </CardText>

                <CardActions>
                  <RaisedButton disabled={this.state.waiting} onClick={this.handleSubmit.bind(this, b.id)} primary={true} label="Add to trade board"/>
                </CardActions>
              </Card>
            )
          }) : null}


          {this.state.books ? this.state.books.map((b) => {
            return (
              <div>
                {b.title} {b.authors ? "(" + b.authors[0] + ")" : ''}
              </div>
            )
          }) : null}


        </Dialog>

        <FloatingActionButton className="fab" mini={true} onClick={this.handleOpen}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}
