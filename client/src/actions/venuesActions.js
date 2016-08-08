import axios from 'axios';
import {API_VENUES_ENDPOINT, API_BASE_URL} from '../constants/endpoints';
import {promptLogin} from './userActions';
import _ from 'lodash';

export function fetchVenues(location) {
  return function (dispatch, getState) {

    dispatch(requestVenues());

    if (!location) {
      location = getState().venues.location;
    }
    dispatch(newLocation(location));

    const endpoint = API_VENUES_ENDPOINT + '?lat=' + location.lat + '&lon=' + location.lon;
    axios.get(endpoint)
      .then((response) => {
        dispatch(receiveVenues(response.data.venues));
      });
  };
}

export function newLocation(location) {
  return {
    type: 'NEW_LOCATION',
    payload: {
      location
    }
  };
}

export function requestVenues() {
  return {
    type: 'REQUEST_VENUES'
  };
}

export function receiveVenues(venues) {
  return {
    type: 'RECEIVE_VENUES',
    payload: {
      venues
    }
  };
}

// TODO: name is deceptive since it actually toggles venue attendance
export function attendVenue(id) {
  return function (dispatch, getState) {
    dispatch(requestAttendVenue());
    const state = getState();
    const venues = state.venues.venues;

    let action = '';
    if (_.keyBy(venues, 'id')[id].userGoing) {
      action = 'unattend';
    } else {
      action = 'attend';
    }

    const endpoint = API_BASE_URL + '/api/venue/' + id + '/' + action;

    axios.post(endpoint, {})
      .then((response) => {
        if (response.data.status === 'error' && response.data.message === 'not logged in') {
          dispatch(promptLogin());
        } else if (response.data.status === 'success') {
          dispatch(receiveAttendVenue(response.data));
          dispatch(fetchVenues());
        }
      });
  };
}

export function requestAttendVenue() {
  return {
    type: 'REQUEST_ATTEND_VENUE'
  };
}

export function receiveAttendVenue() {
  return {
    type: 'RECEIVE_ATTEND_VENUE'
  };
}
