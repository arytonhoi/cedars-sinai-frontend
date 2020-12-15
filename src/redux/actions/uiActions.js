import {
  // errors
  SET_ERROR,
  CLEAR_ERROR,
  CLEAR_ALL_ERRORS,
  // loading
  SET_LOADING_ACTION,
  STOP_LOADING_ACTION,
} from "../types";

// errors
export const setError = (actionName, error) => (dispatch) => {
  error.actionName = actionName;
  dispatch({
    type: SET_ERROR,
    payload: error,
  });
};

export const clearError = (actionName) => (dispatch) => {
  dispatch({
    type: CLEAR_ERROR,
    payload: actionName,
  });
};

export const clearAllErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ALL_ERRORS });
};

// loading
export const setLoadingAction = (actionName) => (dispatch) => {
  dispatch({
    type: SET_LOADING_ACTION,
    payload: actionName,
  });
};

export const stopLoadingAction = (actionName) => (dispatch) => {
  dispatch({
    type: STOP_LOADING_ACTION,
    payload: actionName,
  });
};
