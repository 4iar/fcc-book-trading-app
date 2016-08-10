import initialState from './initialState';


export default function notification(state = initialState.notification, action) {
  switch (action.type) {
    case 'SEND_NOTIFICATION': {
      return {
        ...state,
        newest: action.payload.message,
        count: state.count + 1
      };
    }
    default:
      return state;
  }
}
