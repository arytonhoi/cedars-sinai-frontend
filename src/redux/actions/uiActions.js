import {
  // SET_ERRORS,
  CLEAR_ERRORS,
} from "../types";

export const clearError = (actionName) => (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
    payload: actionName,
  });
};
