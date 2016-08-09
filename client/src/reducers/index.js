import { combineReducers } from 'redux';
import books from './booksReducer';
import user from './userReducer';
import notification from './notificationReducer';
import {routerReducer} from 'react-router-redux';


const rootReducer = combineReducers({
  user,
  books,
  notification,
  routing: routerReducer,
});

export default rootReducer;
