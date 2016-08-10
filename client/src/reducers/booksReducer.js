import initialState from './initialState';


export default function books(state = initialState.books, action) {
  switch (action.type) {
    case 'RECEIVE_BOOKS': {
      return {
        ...state,
        books: action.payload.books,
        loading: false
      };
    }
    case 'REQUEST_BOOKS': {
      return {
        ...state,
        loading: true
      };
    }
    default:
      return state;
  }
}
