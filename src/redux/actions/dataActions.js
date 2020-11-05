import {
  LOADING_DATA,
  STOP_LOADING_DATA,
  LOADING_UI,

  SET_DATA,
  SET_DATA_ARRAY,
  POST_DATA,
  DELETE_DATA,

  SET_ANNOUNCE,
  POST_ANNOUNCE,
  DELETE_ANNOUNCE,

  SET_ERRORS,
  CLEAR_ERRORS,

  SET_CONTACTS,
} from "../types";
import axios from "axios";

// Announcements
export const getAnnouncements = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  return axios
    .get("/announcements")
    .then((res) => {
      dispatch({
        type: SET_ANNOUNCE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ANNOUNCE,
        payload: [],
      });
    });
};

export const postAnnouncement = (newAnn) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/announcements", newAnn)
    .then((res) => {
      dispatch({
        type: POST_ANNOUNCE,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      (typeof(err.response.data)==='undefined')?
      (dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      })):
      (dispatch({
        type: SET_ERRORS,
        payload: {'err':'blank payload'},
      }))
    });
};

// Contacts
export const getContacts = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  return axios
    .get("/contacts")
    .then((res) => {
      dispatch({
        type: SET_CONTACTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_CONTACTS,
        payload: [],
      });
    });
};

//Folders
export const getAllFolders = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  return axios
    .get("/folders")
    .then((res) => {
      dispatch({
        type: SET_DATA_ARRAY,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_DATA_ARRAY,
        payload: [],
      });
    });
};
export const getFolder = (folderName) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/folders/${folderName}`)
    .then((res) => {
      dispatch({
        type: SET_DATA,
        payload: res.data,
      });
    })
    .finally(dispatch({ type: STOP_LOADING_DATA }))
    .catch((err) => dispatch({ type: SET_ERRORS, payload: err }));
};

export const createFolder = (folderName,folderDetails) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`/folders/${folderName}`, folderDetails)
    .then()
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const updateFolder = (folderName,folderDetails) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .patch(`/folders/${folderName}`, folderDetails)
    .then()
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const removeFolder = (folderName) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .delete(`/folders/${folderName}`)
    .then()
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const modifyFolder = (data) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .patch("/folders", data)
    .then((res) => {
      dispatch({
        type: POST_DATA,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

// Delete from DB
export const deletePost = (id) => (dispatch) => {
  axios
    .delete(`/files/${id}`)
    .then(() => {
      dispatch({ type: DELETE_DATA, payload: id });
    })
    .catch((err) => console.log(err));
};
export const deleteAnnounce = (id) => (dispatch) => {
  axios
    .delete(`/announcements/${id}`)
    .then(() => {
      dispatch({ type: DELETE_ANNOUNCE, payload: id });
    })
    .catch((err) => console.log(err));
};

/*
// Submit a comment
export const submitComment = (screamId, commentData) => (dispatch) => {
  axios
    .post(`/scream/${screamId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const getUserData = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then((res) => {
      dispatch({
        type: SET_DATA_ARRAY,
        payload: res.data.screams
      });
    })
    .catch(() => {
      dispatch({
        type: SET_DATA_ARRAY,
        payload: null
      });
    });
};
*/
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
