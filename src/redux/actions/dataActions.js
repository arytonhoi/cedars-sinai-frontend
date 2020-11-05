import {
  LOADING_UI,
  LOADING_DATA,
  STOP_LOADING_DATA,
  SET_ERRORS,
  CLEAR_ERRORS,
  // posts
  SET_POST,
  SET_POSTS,
  POST_POST,
  DELETE_POST,
  // announcements
  SET_ANNOUNCEMENTS,
  POST_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  // departments
  SET_DEPARTMENTS,
  PATCH_DEPARTMENT,
  POST_DEPARTMENT,
  DELETE_DEPARTMENT,
  // contacts
  SET_CONTACTS,
  PATCH_CONTACT,
  POST_CONTACT,
  DELETE_CONTACT,
  SEARCH_CONTACTS,
  //  STOP_LOADING_UI,
} from "../types";
import axios from "axios";

// Announcements
export const getAnnouncements = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  return axios
    .get("/announcements")
    .then((res) => {
      dispatch({
        type: SET_ANNOUNCEMENTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ANNOUNCEMENTS,
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
        type: POST_ANNOUNCEMENT,
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

export const deleteAnnounce = (id) => (dispatch) => {
  axios
    .delete(`/announcements/${id}`)
    .then(() => {
      dispatch({ type: DELETE_ANNOUNCEMENT, payload: id });
    })
    .catch((err) => console.log(err));
};

// Departments
export const getDepartments = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  return axios
    .get("/departments")
    .then((res) => {
      dispatch({
        type: SET_DEPARTMENTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_DEPARTMENTS,
        payload: [],
      });
    });
};

export const postDepartment = (newDepartment) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/departments", newDepartment)
    .then((res) => {
      dispatch({
        type: POST_DEPARTMENT,
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

export const patchDepartment = (updatedDepartmentId, updatedDepartment) => (
  dispatch
) => {
  dispatch({ type: LOADING_UI });
  axios
    .patch(`/departments/${updatedDepartmentId}`, updatedDepartment)
    .then((res) => {
      updatedDepartment.id = updatedDepartmentId;
      dispatch({
        type: PATCH_DEPARTMENT,
        payload: updatedDepartment,
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

export const deleteDepartment = (departmentId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .delete(`/departments/${departmentId}`)
    .then((res) => {
      dispatch({
        type: DELETE_DEPARTMENT,
        payload: departmentId,
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

// contacts
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

export const postContact = (newContact) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/contacts", newContact)
    .then((res) => {
      dispatch({
        type: POST_CONTACT,
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

export const patchContact = (updatedContactId, updatedContact) => (
  dispatch
) => {
  dispatch({ type: LOADING_UI });
  axios
    .patch(`/contacts/${updatedContactId}`, updatedContact)
    .then((res) => {
      updatedContact.id = updatedContactId;
      dispatch({
        type: PATCH_CONTACT,
        payload: updatedContact,
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

export const deleteContact = (contactId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .delete(`/contacts/${contactId}`)
    .then((res) => {
      dispatch({
        type: DELETE_CONTACT,
        payload: contactId,
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

export const getSearchedContacts = (searchTerm) => (dispatch) => {
  dispatch({
    type: SEARCH_CONTACTS,
    payload: searchTerm,
  });
};

// posts
export const getPosts = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  return axios
    .get("/files")
    .then((res) => {
      dispatch({
        type: SET_POSTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_POSTS,
        payload: [],
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
        payload: res.data,
      });
    })
    .finally(dispatch({ type: STOP_LOADING_DATA }))
    .catch((err) => dispatch({ type: SET_ERRORS, payload: err }));
};

export const postPost = (newPost) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/scream", newPost)
    .then((res) => {
      dispatch({
        type: POST_POST,
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
      dispatch({ type: DELETE_POST, payload: id });
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
*/
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
