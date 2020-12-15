import {
  LOADING_USER,
  SET_UNAUTHENTICATED,
  SET_USER,
  PATCH_PASSWORD,
  // errors
  SET_ERROR,
} from "../types";

import { clearError } from "./uiActions";

import axios from "axios";

// antd
import { notification } from "antd";

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
  return axios
    .patch("/user/password", reqBody)
    .then((res) => {
      dispatch({
        type: PATCH_PASSWORD,
        payload: res.data,
      });
      // clear errors
      clearError("patchUserPassword");
      // dispatch({
      //   type: CLEAR_ERROR,
      //   payload: "patchUserPassword",
      // });
      if (reqBody.username === "admin") {
        notification["success"]({
          message: "Success!",
          description: "Password changed successfully! Logging out... ",
        });
        setTimeout(function () {
          localStorage.removeItem("hasValidCookie");
          dispatch({ type: SET_UNAUTHENTICATED });
          window.location.href = "./login";
        }, 3000);
      } else {
        notification["success"]({
          message: "Success!",
          description:
            "Password changed successfully! Staff will need to re-login.",
        });
      }
    })
    .catch((err) => {
      const error = {
        patchUserPassword: err.response.data,
      };
      error.patchUserPassword.user = reqBody.username;
      dispatch({
        type: SET_ERROR,
        payload: error,
      });
    });
};
