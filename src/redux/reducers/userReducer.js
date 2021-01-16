import { SET_AUTHENTICATED, SET_UNAUTHENTICATED, SET_USER, PATCH_PASSWORD } from "../types";

const initialState = {
  authenticated: false,
  isAdmin: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        isAdmin: action.payload.isAdmin,
      };
    case PATCH_PASSWORD:
      return state;
    default:
      return state;
  }
};
