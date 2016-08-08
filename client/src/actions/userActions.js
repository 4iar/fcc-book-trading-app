import showLogin from '../utils/showLogin';

export function promptLogin() {
  return (dispatch, getState) => {
    showLogin(getState().venues.location);
  };
}
