import initialState from './initialState';


export default function user(state = initialState.user, action) {
  switch (action.type) {
    case 'RECEIVE_VENUES': {
      return {
        ...state,
        venues: action.payload.venues
      };
    }
    case 'REQUEST_VENUES': {
      return {
        ...state,
        loading: true
      };
    }
    case 'NEW_LOCATION': {
      return {
        ...state,
        location: action.payload.location
      };
    }
    default:
      return state;
  }
}
