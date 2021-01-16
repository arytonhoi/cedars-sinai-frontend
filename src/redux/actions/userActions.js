import { SET_UNAUTHENTICATED, SET_USER, PATCH_PASSWORD } from "../types";

import { clearError, setError, setLoadingAction, stopLoadingAction } from "./uiActions";

import axios from "axios";

const setAuthorizationHeader = () => {
  localStorage.setItem("hasValidCookie", true);
};

export const loginUser = (userData) => (dispatch) => {
  dispatch(setLoadingAction(SET_USER));
  axios
    .post("/login", userData)
    .then((res) => {
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(SET_USER));
      dispatch(clearError(SET_USER));
      setAuthorizationHeader();
      dispatch(getUserData());
      window.location.href = "./";
    })
    .catch((err) => {
      dispatch(stopLoadingAction(SET_USER));
      dispatch(setError(SET_USER, err));
    });
};

export const getUserData = () => (dispatch) => {
  axios
    .get("/user")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      localStorage.removeItem("hasValidCookie");
      dispatch(setError(SET_USER, err));
      dispatch({ type: SET_UNAUTHENTICATED });
    });
};

export const logoutUser = () => (dispatch) => {
  axios
    .post("/logout")
    .then((res) => {
      localStorage.removeItem("hasValidCookie");
      dispatch({ type: SET_UNAUTHENTICATED });
      window.location.href = "./login";
    })
    .catch((err) => {
      console.log(err);
      localStorage.removeItem("hasValidCookie");
      dispatch({ type: SET_UNAUTHENTICATED });
      window.location.href = "./login";
    });
};

export const patchUserPassword = (reqBody) => (dispatch) => {
  let actionName = `${PATCH_PASSWORD}_${reqBody.username}`;
  dispatch(setLoadingAction(actionName));
  return axios
    .patch("/user/password", reqBody)
    .then((res) => {
      dispatch({
        type: PATCH_PASSWORD,
        payload: res.data,
      });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(actionName));
    })
    .catch((err) => {
      dispatch(setError(actionName, err));
    });
};
