import { combineReducers } from 'redux';
import books from './booksReducer';
import user from './userReducer';
import {routerReducer} from 'react-router-redux';


const rootReducer = combineReducers({
  user,
  books,
  routing: routerReducer,
});

export default rootReducer;
