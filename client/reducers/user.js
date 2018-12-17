import { combineReducers } from 'redux'
import * as types from '../types';

const user = (state = null, action) => {
  switch (action.type) {
    case types.SET_USER_FROM_TOKEN:
      return action.payload || null;
    case types.LOGOUT_USER:
      return null;
    default:
      return state
  }
};

export default combineReducers({
  user,
})
