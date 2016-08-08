/*global Auth0Lock */
import {API_AUTH_CALLBACK} from '../constants/endpoints';

export default function showLogin() {
  const lock = new Auth0Lock('vpvFEoD6HbfvvlJTOKxTWTDAZJPNVbhz', 'booktrade-4iar.eu.auth0.com', {
    auth: {
      redirectUrl: API_AUTH_CALLBACK,
      responseType: 'code',
      params: {
        scope: 'openid email' // Learn about scopes: https://auth0.com/docs/scopes
      }
    }
  });

  lock.show();
}
