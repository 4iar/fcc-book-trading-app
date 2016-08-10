import axios from 'axios';
import {API_CURRENT_USER_ENDPOINT} from '../constants/endpoints';
import showLogin from '../utils/showLogin';

export function promptLogin() {
  return () => {
    showLogin();
  };
}

export function requestCurrentUser() {
  return {
    type: 'REQUEST_CURRENT_USER'
  };
}

export function receiveCurrentUser(id) {
  return {
    type: 'RECEIVE_CURRENT_USER',
    payload: {
      id
    }
  };
}

export function fetchCurrentUser() {
  return function (dispatch) {
    dispatch(requestCurrentUser());
    const endpoint = API_CURRENT_USER_ENDPOINT;
    axios.get(endpoint)
      .then((response) => {
        if (response.data.status === 'success') {
          dispatch(receiveCurrentUser(response.data.userId));
        }
      });
  };
}
