import {
  // Images
  GET_BANNER_IMAGE,
  PATCH_BANNER_IMAGE,
  // Announcements
  SET_ANNOUNCEMENTS,
  POST_ANNOUNCEMENT,
  PATCH_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  FILTER_ANNOUNCEMENTS,
} from "../types";

import { setError, setLoadingAction, stopLoadingAction } from "./uiActions";

import axios from "axios";

// Images
export const getBannerImage = (pageName) => (dispatch) => {
  return axios.get(`/banners/${pageName}`).then((res) => {
    const bannerImgObj = res.data;
    bannerImgObj.pageName = pageName;
    dispatch({
      type: GET_BANNER_IMAGE,
      payload: bannerImgObj,
    });
  });
};

export const patchBannerImage = (pageName, newImgUrlObj) => (dispatch) => {
  return axios.patch(`/banners/${pageName}`, newImgUrlObj).then((res) => {
    newImgUrlObj.pageName = pageName;

    dispatch({
      type: PATCH_BANNER_IMAGE,
      payload: newImgUrlObj,
    });
  });
};

// Announcements
export const getAnnouncements = () => (dispatch) => {
  dispatch(setLoadingAction(SET_ANNOUNCEMENTS));
  return axios
    .get("/announcements")
    .then((res) => {
      dispatch({
        type: SET_ANNOUNCEMENTS,
        payload: res.data,
      });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(SET_ANNOUNCEMENTS));
    })
    .catch((err) => {
      dispatch(setError(POST_ANNOUNCEMENT, err));
    });
};

export const postAnnouncement = (newAnnouncement) => (dispatch) => {
  dispatch(setLoadingAction(POST_ANNOUNCEMENT));
  axios
    .post("/announcements", newAnnouncement)
    .then((res) => {
      dispatch({
        type: POST_ANNOUNCEMENT,
        payload: res.data,
      });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(POST_ANNOUNCEMENT));
    })
    .catch((err) => {
      dispatch(setError(POST_ANNOUNCEMENT, err));
    });
};

export const patchAnnouncement = (
  updatedAnnnouncementId,
  updatedAnnnouncement
) => (dispatch) => {
  dispatch(setLoadingAction(PATCH_ANNOUNCEMENT));
  axios
    .patch(`/announcements/${updatedAnnnouncementId}`, updatedAnnnouncement)
    .then((res) => {
      updatedAnnnouncement.id = updatedAnnnouncementId;
      dispatch({
        type: PATCH_ANNOUNCEMENT,
        payload: updatedAnnnouncement,
      });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(PATCH_ANNOUNCEMENT));
    })
    .catch((err) => {
      dispatch(setError(PATCH_ANNOUNCEMENT, err));
    });
};

export const deleteAnnouncement = (id) => (dispatch) => {
  dispatch(setLoadingAction(DELETE_ANNOUNCEMENT));
  axios
    .delete(`/announcements/${id}`)
    .then((res) => {
      dispatch({ type: DELETE_ANNOUNCEMENT, payload: id });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(DELETE_ANNOUNCEMENT));
    })
    .catch((err) => {
      dispatch(setError(DELETE_ANNOUNCEMENT, err));
    });
};

export const getFilteredAnnouncements = (filters) => (dispatch) => {
  dispatch({
    type: FILTER_ANNOUNCEMENTS,
    payload: filters,
  });
};
