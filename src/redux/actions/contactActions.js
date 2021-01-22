import {
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
} from "../types";

import { setError, setLoadingAction, stopLoadingAction } from "./uiActions";

import axios from "axios";

// Departments
export const getDepartments = () => (dispatch) => {
  dispatch(setLoadingAction(SET_DEPARTMENTS));
  return axios
    .get("/departments")
    .then((res) => {
      dispatch({
        type: SET_DEPARTMENTS,
        payload: res.data,
      });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(SET_DEPARTMENTS));
    })
    .catch((err) => {
      dispatch(setError(SET_DEPARTMENTS, err));
    });
};

export const postDepartment = (newDepartment) => (dispatch) => {
  dispatch(setLoadingAction(POST_DEPARTMENT));
  axios
    .post("/departments", newDepartment)
    .then((res) => {
      dispatch({
        type: POST_DEPARTMENT,
        payload: res.data,
      });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(POST_DEPARTMENT));
    })
    .catch((err) => {
      dispatch(setError(POST_DEPARTMENT, err));
    });
};

export const patchDepartment = (updatedDepartmentId, updatedDepartment) => (dispatch) => {
  dispatch(setLoadingAction(PATCH_DEPARTMENT));
  axios
    .patch(`/departments/${updatedDepartmentId}`, updatedDepartment)
    .then((res) => {
      updatedDepartment.id = updatedDepartmentId;
      dispatch({
        type: PATCH_DEPARTMENT,
        payload: updatedDepartment,
      });
    })
    .then(() => {
      dispatch(stopLoadingAction(PATCH_DEPARTMENT));
    })
    .catch((err) => {
      dispatch(setError(PATCH_DEPARTMENT, err));
    });
};

export const deleteDepartment = (departmentId) => (dispatch) => {
  dispatch(setLoadingAction(DELETE_DEPARTMENT));
  axios
    .delete(`/departments/${departmentId}`)
    .then((res) => {
      dispatch({
        type: DELETE_DEPARTMENT,
        payload: departmentId,
      });
    })
    .then(() => {
      dispatch(stopLoadingAction(DELETE_DEPARTMENT));
    })
    .catch((err) => {
      dispatch(setError(DELETE_DEPARTMENT, err));
    });
};

// contacts
export const getContacts = () => (dispatch) => {
  dispatch(setLoadingAction(SET_CONTACTS));
  return axios
    .get("/contacts")
    .then((res) => {
      dispatch({
        type: SET_CONTACTS,
        payload: res.data,
      });
    })
    .then(() => {
      dispatch(stopLoadingAction(SET_CONTACTS));
    })
    .catch((err) => {
      dispatch(setError(SET_CONTACTS, err));
    });
};

export const postContact = (newContact) => (dispatch) => {
  dispatch(setLoadingAction(POST_CONTACT));
  axios
    .post("/contacts", newContact)
    .then((res) => {
      dispatch({
        type: POST_CONTACT,
        payload: res.data,
      });
    })
    .then(() => {
      dispatch(stopLoadingAction(POST_CONTACT));
    })
    .catch((err) => {
      dispatch(setError(POST_CONTACT, err));
    });
};

export const patchContact = (updatedContactId, updatedContact) => (dispatch) => {
  dispatch(setLoadingAction(PATCH_CONTACT));
  console.log(updatedContact);
  axios
    .patch(`/contacts/${updatedContactId}`, updatedContact)
    .then((res) => {
      updatedContact.id = updatedContactId;
      dispatch({
        type: PATCH_CONTACT,
        payload: updatedContact,
      });
    })
    .then(() => {
      dispatch(stopLoadingAction(PATCH_CONTACT));
    })
    .catch((err) => {
      dispatch(setError(PATCH_CONTACT, err));
    });
};

export const deleteContact = (contactId) => (dispatch) => {
  dispatch(setLoadingAction(DELETE_CONTACT));
  axios
    .delete(`/contacts/${contactId}`)
    .then((res) => {
      dispatch({
        type: DELETE_CONTACT,
        payload: contactId,
      });
    })
    .then(() => {
      dispatch(stopLoadingAction(DELETE_CONTACT));
    })
    .catch((err) => {
      dispatch(setError(DELETE_CONTACT, err));
    });
};

export const getSearchedContacts = (searchTerm) => (dispatch) => {
  dispatch({
    type: SEARCH_CONTACTS,
    payload: searchTerm,
  });
};
