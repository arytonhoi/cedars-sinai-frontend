import {
  // Newsletters
  SET_NEWSLETTERS,
  PATCH_NEWSLETTER,
  DELETE_NEWSLETTER,
  POST_NEWSLETTER,
} from "../types";

import { setError, setLoadingAction, stopLoadingAction } from "./uiActions";

import axios from "axios";

// Newsletters
export const getNewsletters = () => (dispatch) => {
  dispatch(setLoadingAction(SET_NEWSLETTERS));
  return axios
    .get("/newsletters")
    .then((res) => {
      dispatch({
        type: SET_NEWSLETTERS,
        payload: res.data,
      });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(SET_NEWSLETTERS));
    })
    .catch((err) => {
      dispatch(setError(SET_NEWSLETTERS, err));
    });
};

export const postNewsletter = (newNewsletter) => (dispatch) => {
  dispatch(setLoadingAction(POST_NEWSLETTER));
  axios
    .post("/newsletters", newNewsletter)
    .then((res) => {
      dispatch({
        type: POST_NEWSLETTER,
        payload: res.data,
      });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(POST_NEWSLETTER));
    })
    .catch((err) => {
      dispatch(setError(POST_NEWSLETTER, err));
    });
};

export const patchNewsletter = (updatedNewsletterId, updatedNewsletter) => (dispatch) => {
  dispatch(setLoadingAction(PATCH_NEWSLETTER));
  axios
    .patch(`/newsletters/${updatedNewsletterId}`, updatedNewsletter)
    .then((res) => {
      updatedNewsletter.id = updatedNewsletterId;
      dispatch({
        type: PATCH_NEWSLETTER,
        payload: updatedNewsletter,
      });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(PATCH_NEWSLETTER));
    })
    .catch((err) => {
      dispatch(setError(PATCH_NEWSLETTER, err));
    });
};

export const deleteNewsletter = (id) => (dispatch) => {
  dispatch(setLoadingAction(DELETE_NEWSLETTER));
  axios
    .delete(`/newsletters/${id}`)
    .then((res) => {
      dispatch({ type: DELETE_NEWSLETTER, payload: id });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(DELETE_NEWSLETTER));
    })
    .catch((err) => {
      dispatch(setError(DELETE_NEWSLETTER, err));
    });
};
