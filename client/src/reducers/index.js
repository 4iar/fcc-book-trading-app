import { combineReducers } from 'redux';
import venues from './venuesReducer';
import user from './userReducer';
import {routerReducer} from 'react-router-redux';


const rootReducer = combineReducers({
  user,
  venues,
  routing: routerReducer,
});

export default rootReducer;
