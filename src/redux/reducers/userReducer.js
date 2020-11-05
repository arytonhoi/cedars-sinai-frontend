import {
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,

  SET_USER,
  LOADING_USER,
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {
    isAdmin: false,
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
        credentials: action.payload,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        credentials: action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
