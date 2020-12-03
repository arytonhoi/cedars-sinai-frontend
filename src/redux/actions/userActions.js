import {
  LOADING_UI,
  LOADING_USER,
  SET_UNAUTHENTICATED,
  SET_USER,
  PATCH_PASSWORD,
  // errors
  SET_ERRORS,
  CLEAR_ERRORS,
} from "../types";
import axios from "axios";

const setAuthorizationHeader = () => {
  localStorage.setItem("hasValidCookie", true);
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then((res) => {
      setAuthorizationHeader();
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
      window.location.href = "./";
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
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
  localStorage.removeItem("hasValidCookie");
  dispatch({ type: SET_UNAUTHENTICATED });
  axios
    .post("/logout")
    .then((res) => {
      localStorage.removeItem("hasValidCookie");
      dispatch({ type: SET_UNAUTHENTICATED });
    })
    .catch((err) => console.log(err));
};

export const patchUserPassword = (reqBody) => (dispatch) => {
  return axios
    .patch("/user/password", reqBody)
    .then((res) => {
      dispatch({
        type: PATCH_PASSWORD,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      const error = {
        patchUserPassword: err.response.data,
      };
      error.patchUserPassword.user = reqBody.username;
      dispatch({
        type: SET_ERRORS,
        payload: error,
      });
    });
};
