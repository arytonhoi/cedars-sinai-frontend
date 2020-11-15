import {
  //UI
  LOADING_UI,
  //STOP_LOADING_UI,
  LOADING_DATA,
  //STOP_LOADING_DATA,
  // Errors
  SET_ERRORS,
  CLEAR_ERRORS,
  // Data Handling
  SET_DATA,
  SET_DATA_ARRAY,
  //POST_DATA,
  DELETE_DATA,
  // Images
  POST_IMAGE,
  // Announcements
  SET_ANNOUNCEMENTS,
  POST_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  // Departments
  SET_DEPARTMENTS,
  PATCH_DEPARTMENT,
  POST_DEPARTMENT,
  DELETE_DEPARTMENT,
  // Contacts
  SET_CONTACTS,
  PATCH_CONTACT,
  POST_CONTACT,
  DELETE_CONTACT,
  SEARCH_CONTACTS,

  // Folders
  ADD_SUBFOLDER,
  PATCH_FOLDER,
  PATCH_SUBFOLDER,
  DELETE_SUBFOLDER,
  SET_NAV_PATH,
  RESET_NAV_PATH,

} from "../types";
import axios from "axios";

// Images
export const postImage = (formData) => (dispatch) => {
  // dispatch({ type: LOADING_UI });
  axios
    .post(`/images`, formData)
    .then((res) => {
      return res.data.imgUrl;
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

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
      typeof err.response.data === "undefined"
        ? dispatch({
            type: SET_ERRORS,
            payload: err.response.data,
          })
        : dispatch({
            type: SET_ERRORS,
            payload: { err: "blank payload" },
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
      dispatch({
        type: SET_NAV_PATH,
        payload: res.data,
      });
    })
    .catch((err) => dispatch({ type: SET_ERRORS, payload: err }));
};

export const getNavRoute = (folderName) => (dispatch) => {
  (typeof(folderName) === 'undefined')?
  (dispatch({ type: RESET_NAV_PATH })):
  (axios
    .get(`/folders/${folderName}`)
    .then((res) => {
      dispatch({
        type: SET_NAV_PATH,
        payload: res.data,
      });
    })
    .catch((err) => dispatch({ type: SET_ERRORS, payload: err })))
};

export const createFolder = (folderName, folderDetails) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`/folders/${folderName}`, folderDetails)
    .then((res) => {
      dispatch({
        type: ADD_SUBFOLDER,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const updateFolder = (folderName, folderDetails) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  if (folderName === folderDetails.parent) {
    dispatch({
      type: SET_ERRORS,
      payload: { error: "Cannot move folder into itself." },
    });
  } else {
    axios
      .patch(`/folders/${folderName}`, folderDetails)
      .then((res) => {
        dispatch({
          type: PATCH_FOLDER,
          payload: folderDetails,
        });
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data,
        });
      });
  }
};

export const updateSubFolder = (folderName, folderDetails) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .patch(`/folders/${folderName}`, folderDetails)
    .then((res) => {
      dispatch({
        type: PATCH_SUBFOLDER,
        payload: { id: folderName, patch: folderDetails },
      });
      dispatch({
        type: DELETE_SUBFOLDER,
        payload: folderName,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const deleteFolder = (folderName) => (dispatch) => {
  axios
    .delete(`/folders/${folderName}`)
    .then((res) => {
      dispatch({
        type: DELETE_SUBFOLDER,
        payload: folderName,
      });
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

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
