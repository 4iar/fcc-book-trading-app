import React from 'react';
import { connect } from 'react-redux';
import Masonry from 'react-masonry-component';

import BookCard from '../components/BookCard';
import NavBar from '../components/NavBar';
import AddBook from '../components/AddBook.js'
import TradeRequests from '../components/TradeRequests';
import Notifications from '../components/Notifications';
import UserInfoEdit from '../components/UserInfoEdit';
import '../styles/homepage.scss';


function getState(state) {
  return {
    books: state.books.books,
  };
}

@connect(getState)
export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      books: undefined,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      books: newProps.books,
    });
  }

  render() {
    return (
      <div>
        <NavBar />
        <UserInfoEdit />
        <TradeRequests />

        {this.state.books && this.state.books.length === 0 &&
        <h2 style={{textAlign: 'center'}}>Nothing going on here :(</h2>
        }

        <div className="books-masonry">
          <Masonry
            className={'my-gallery-class'} // default ''
            elementType={'div'} // default 'div'
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
          >
            {this.state.books && this.state.books.length > 0 &&
            this.state.books.map((b) => {
              return (
                <BookCard key={b.id} book={b}/>
              );
            })}
          </Masonry>
        </div>

        <AddBook/>
        <Notifications/>
      </div>
    );
  }
}
