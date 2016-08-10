import React from 'react';
import {Card, CardActions, CardText, CardMedia} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import ActionCompareArrows from 'material-ui/svg-icons/action/compare-arrows';
import {connect} from 'react-redux';
import axios from 'axios';
import _ from 'lodash';

import {promptLogin} from '../actions/userActions';
import {sendNotification} from '../actions/notificationActions';
import {API_BOOK_ACTIONS_ENDPOINT} from '../constants/endpoints';

import '../styles/bookcard.scss';


@connect(null, {promptLogin, sendNotification})
export default class BookCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getBookObj(this.props.book);
  }

  componentWillReceiveProps(newProps) {
    this.setState(this.getBookObj(newProps.book));
  }

  getBookObj(book) {
    return {
      title: book.metadata.title,
      author: book.metadata.authors[0],
      moreInfoUrl: book.metadata.link,
      thumbnailUrl: book.metadata.images.medium,
      rating: book.metadata.averageRating,
      ratingCount: book.metadata.ratingsCount,
      description: book.metadata.description,
      tradeStatus: book.tradeStatus,
      categories: book.metadata.categories,
      id: book.id
    };
  }

  handleClick() {
    this.setState({
      waiting: true
    });

    const endpoint = API_BOOK_ACTIONS_ENDPOINT + this.state.id;
    axios.post(endpoint, {action: 'propose'})
      .then((response) => {
        this.props.sendNotification(response.data.status, response.data.message);
        if (response.data.status === 'error') {
          if (response.data.message === 'not logged in') {
            this.props.promptLogin()
          }
        }
        this.setState({
          waiting: false
        });
      });
  }

  render() {
    let categories = [];
    console.log(this.state.categories);
    if (this.state.categories) {
      this.state.categories.map((c) => {
        categories = categories.concat(c.split('/'));
      })
      categories = _.uniq(categories); // shouold really put this in state instead of rawcategories
    }
    return (
      <Card className="book-card-container">

        <CardMedia className="image">
          <img src={this.state.thumbnailUrl} />
        </CardMedia>

        <CardText>
          {!this.state.thumbnailUrl &&
          <div>
            <p>no image available</p>
            <h1>{this.state.title}</h1>
          </div>
          }
          {this.state.rating &&
          <h2 className="align-left">{this.state.rating}/5 across {this.state.ratingCount} votes</h2>
          }

          <div className="genre-chip-container">
          {categories.map((c) => {
            return (<Chip className="genre-chip">{c}</Chip>)
          })}
          </div>

        </CardText>

        <CardText className="description">
          {this.state.description.replace(/<(?:.|\n)*?>/gm, '')}
        </CardText>

        <CardActions>
            <RaisedButton
              label={this.state.tradeStatus ? "Unavailable" : "Trade"}
              labelPosition="before"
              disabled={this.state.waiting || this.state.tradeStatus}
              primary={true}
              icon={<ActionCompareArrows secondary={true}/>}
              onClick={this.handleClick.bind(this)}
            />
        </CardActions>
      </Card>
    );
  }
}
