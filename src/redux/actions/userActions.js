import {
  LOADING_UI,
  SET_UNAUTHENTICATED,
  SET_USER,
  LOADING_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
} from "../types";
import axios from "axios";

const setAuthorizationHeader = () => {
  localStorage.setItem("hasValidCookie", true);
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

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("hasValidCookie");
  dispatch({ type: SET_UNAUTHENTICATED });
  // axios
  //   .post("/logout")
  //   .then((res) => {
  //     // localStorage.removeItem("hasValidCookie");
  //     localStorage.setItem("hasValidCookie", false);
  //     dispatch({ type: SET_UNAUTHENTICATED });
  //   })
  //   .catch((err) => console.log(err));
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
      // window.location.href = "/";
    });
};

export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user/image", formData)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user", userDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};
