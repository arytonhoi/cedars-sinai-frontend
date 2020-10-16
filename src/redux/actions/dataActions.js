import {
  SET_POSTS,
  LOADING_DATA,
  STOP_LOADING_DATA,
  DELETE_POST,
  SET_ERRORS,
  POST_POST,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_POST,
  SET_ANNOUNCE,
  STOP_LOADING_UI,
  SUBMIT_COMMENT
} from '../types';
import axios from 'axios';

export const getAnnounce = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  return axios
    .get('/announcements')
    .then((res) => {
      dispatch({
        type: SET_ANNOUNCE,
        payload: res.data
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ANNOUNCE,
        payload: []
      });
    });
};

export const getPosts = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  return axios
    .get('/files')
    .then((res) => {
      dispatch({
        type: SET_POSTS,
        payload: res.data
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_POSTS,
        payload: []
      });
    });
};
export const getPost = (fileName) => (dispatch) => {
  dispatch({ type: LOADING_DATA }); 
  axios
    .get(`/files/${fileName}`)
    .then((res) => {
      dispatch({
        type: SET_POST,
        payload: res.data
      });
    }).finally(
      dispatch({ type: STOP_LOADING_DATA }) 
    ).catch((err) => dispatch({ type: SET_ERRORS, payload: err }))
};
// Post a scream
export const postPost = (newPost) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/scream', newPost)
    .then((res) => {
      dispatch({
        type: POST_POST,
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
export const deletePost = (screamId) => (dispatch) => {
  axios
    .delete(`/scream/${screamId}`)
    .then(() => {
      dispatch({ type: DELETE_POST, payload: screamId });
    })
    .catch((err) => console.log(err));
};

export const getUserData = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then((res) => {
      dispatch({
        type: SET_POSTS,
        payload: res.data.screams
      });
    })
    .catch(() => {
      dispatch({
        type: SET_POSTS,
        payload: null
      });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
