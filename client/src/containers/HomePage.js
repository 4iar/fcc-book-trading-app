import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import Masonry from 'react-masonry-component';

import BookCard from '../components/BookCard';
import NavBar from '../components/NavBar';
import '../styles/homepage.scss';


function getState(state) {
  return {
    books: state.books.books,
    loading: state.books.loading
  };
}

@connect(getState)
export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      books: undefined,
      loading: false
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      books: newProps.books,
      loading: newProps.loading
    });
  }

  render() {
    return (
      <div>
        <NavBar />
        {this.state.loading &&
        <div className="loading-spinner-container">
          <CircularProgress className="loading-spinner" size={1} />
        </div>
        }

        {this.state.books && this.state.books.length === 0 &&
        <h2 style={{textAlign: 'center'}}>Nothing going on here :(</h2>
        }

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
    );
  }
}
