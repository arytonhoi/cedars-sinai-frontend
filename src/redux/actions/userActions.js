import {
  LOADING_USER,
  SET_UNAUTHENTICATED,
  SET_USER,
  PATCH_PASSWORD,
  // errors
  SET_ERROR,
} from "../types";

import { setError, setLoadingAction, stopLoadingAction } from "./uiActions";

import axios from "axios";

const setAuthorizationHeader = () => {
  localStorage.setItem("hasValidCookie", true);
};

export const loginUser = (userData, history) => (dispatch) => {
  axios
    .post("/login", userData)
    .then((res) => {
      setAuthorizationHeader();
      dispatch(getUserData());
      // dispatch({ type: CLEAR_ERROR });
      history.push("/");
      window.location.href = "./";
    })
    .catch((err) => {
      dispatch({
        type: SET_ERROR,
        payload: err.response.data,
      });
    });
};

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get("/user")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      localStorage.removeItem("hasValidCookie");
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
      dispatch(setError(actionName, err.response.data));
    });
};
