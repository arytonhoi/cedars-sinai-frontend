import {
  LOADING_UI,
  STOP_LOADING_UI,

  SET_ERRORS,
  CLEAR_ERRORS,
} from '../types';

const initialState = {
  loading: false,
  errors: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      state.errors.push(action.payload)
      return {
        ...state,
        loading: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: []
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true
      };
    case STOP_LOADING_UI:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
