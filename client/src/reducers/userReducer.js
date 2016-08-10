import initialState from './initialState';


export default function user(state = initialState.user, action) {
  switch (action.type) {
    case 'RECEIVE_CURRENT_USER': {
      return {
        ...state,
        id: action.payload.id
      };
    }
    default:
      return state;
  }
}
