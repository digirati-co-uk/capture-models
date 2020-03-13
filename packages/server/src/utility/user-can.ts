import { ApplicationState, JWTScopes } from '../types';

export function userCan(scope: JWTScopes, state: ApplicationState) {
  return state.jwt.scope.indexOf(scope) !== -1;
}
