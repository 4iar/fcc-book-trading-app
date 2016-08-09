import axios from 'axios';
import {API_BOOKS_ENDPOINT} from '../constants/endpoints';


export function requestBooks() {
  return {
    type: 'REQUEST_BOOKS'
  };
}

export function receiveBooks(books) {
  return {
    type: 'RECEIVE_BOOKS',
    payload: {
      books
    }
  };
}

export function fetchBooks() {
  return function (dispatch) {
    dispatch(requestBooks());
    const endpoint = API_BOOKS_ENDPOINT;
    axios.get(endpoint)
      .then((response) => {
        dispatch(receiveBooks(response.data.books));
      });
  };
}
