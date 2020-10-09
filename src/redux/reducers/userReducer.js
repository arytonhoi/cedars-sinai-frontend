import {
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_ADMIN,
  SET_USER,
  LOADING_USER,
} from '../types';

const initialState = {
  authenticated: false,
  is_admin: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_ADMIN:
      return {
        ...state,
        is_admin: true
      };
    case SET_USER:
      return {
        authenticated: true,
        is_admin: state.is_admin,
        loading: false,
        ...action.payload
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
