import showLogin from '../utils/showLogin';

export function promptLogin() {
  return () => {
    showLogin();
  };
}
