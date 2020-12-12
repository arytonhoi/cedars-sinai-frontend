import {
  // errors
  SET_ERROR,
  CLEAR_ERROR,
  // loading
  SET_LOADING_ACTION,
  STOP_LOADING_ACTION,
  SET_LOADING_PAGE,
  STOP_LOADING_PAGE,
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

export const setLoadingPage = () => (dispatch) => {
  dispatch({ type: SET_LOADING_PAGE });
};

export const stopLoadingPage = () => (dispatch) => {
  dispatch({ type: STOP_LOADING_PAGE });
};
