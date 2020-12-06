import {
  //UI
  LOADING_UI,
  LOADING_FOLDER_SEARCH,
  STOP_LOADING_FOLDER_SEARCH,
  //STOP_LOADING_UI,
  LOADING_DATA,
  //STOP_LOADING_DATA,
  // Errors
  SET_ERRORS,
  CLEAR_ERRORS,
  // images
  // POST_IMAGE,
  GET_BANNER_IMAGE,
  PATCH_BANNER_IMAGE,
  // Announcements
  SET_ANNOUNCEMENTS,
  POST_ANNOUNCEMENT,
  PATCH_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  FILTER_ANNOUNCEMENTS,
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
  SET_FOLDER,
  POST_FOLDER,
  PATCH_FOLDER,
  PATCH_SUBFOLDER,
  SORT_SUBFOLDER,
  DELETE_SUBFOLDER,
  SET_NAV_PATH,
  RESET_NAV_PATH,
  SET_FOLDER_SEARCH_RES,
} from "../types";
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

export const postAnnouncement = (newAnnouncement) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/announcements", newAnnouncement)
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

export const patchAnnouncement = (
  updatedAnnnouncementId,
  updatedAnnnouncement
) => (dispatch) => {
  // dispatch({ type: LOADING_UI });
  axios
    .patch(`/announcements/${updatedAnnnouncementId}`, updatedAnnnouncement)
    .then((res) => {
      updatedAnnnouncement.id = updatedAnnnouncementId;
      dispatch({
        type: PATCH_ANNOUNCEMENT,
        payload: updatedAnnnouncement,
      });
      // dispatch(clearErrors());
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const deleteAnnouncement = (id) => (dispatch) => {
  axios
    .delete(`/announcements/${id}`)
    .then(() => {
      dispatch({ type: DELETE_ANNOUNCEMENT, payload: id });
    })
    .catch((err) => console.log(err));
};

export const getFilteredAnnouncements = (filters) => (dispatch) => {
  dispatch({
    type: FILTER_ANNOUNCEMENTS,
    payload: filters,
  });
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

// Folders
export const getFolder = (folderName, track) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(
      `/folders/${folderName}?${
        typeof track !== "undefined" && track === true ? "i" : ""
      }`
    )
    .then((res) => {
      const folder = res.data;
      dispatch({
        type: SET_FOLDER,
        payload: folder,
      });
      dispatch({
        type: SORT_SUBFOLDER,
        payload: folder.defaultSubfolderSort,
      });
      dispatch({
        type: SET_NAV_PATH,
        payload: folder,
      });
    })
    .catch((err) => dispatch({ type: SET_ERRORS, payload: err }));
};

export const searchFolder = (searchKey) => (dispatch) => {
  dispatch({
    type: LOADING_FOLDER_SEARCH,
  });
  axios
    .get(`/folders/search/${searchKey}`)
    .then((res) => {
      dispatch({
        type: SET_FOLDER_SEARCH_RES,
        payload: res.data,
      });
      dispatch({
        type: STOP_LOADING_FOLDER_SEARCH,
      });
    })
    .catch((err) => dispatch({ type: SET_ERRORS, payload: err }));
};

export const getNavRoute = (folderName) => (dispatch) => {
  typeof folderName === "undefined"
    ? dispatch({ type: RESET_NAV_PATH })
    : axios
        .get(`/folders/${folderName}`)
        .then((res) => {
          dispatch({
            type: SET_NAV_PATH,
            payload: res.data,
          });
        })
        .catch((err) => dispatch({ type: SET_ERRORS, payload: err }));
};

export const postFolder = (folderName, folderDetails) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`/folders/${folderName}`, folderDetails)
    .then((res) => {
      dispatch({
        type: POST_FOLDER,
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

export const patchFolder = (folderId, updatedFolder) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  if (folderId === updatedFolder.parent) {
    dispatch({
      type: SET_ERRORS,
      payload: { error: "Cannot move folder into itself." },
    });
  } else {
    axios
      .patch(`/folders/${folderId}`, updatedFolder)
      .then((res) => {
        dispatch({
          type: PATCH_FOLDER,
          payload: updatedFolder,
        });
      })
      .catch((err) => {
        console.log(err);
        // dispatch({
        //   type: SET_ERRORS,
        //   payload: err.response.data,
        // });
      });
  }
};

export const patchSubfolder = (folderId, updatedFolder) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .patch(`/folders/${folderId}`, updatedFolder)
    .then((res) => {
      dispatch({
        type: PATCH_SUBFOLDER,
        payload: { id: folderId, patch: updatedFolder },
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

// export const syncAllSubFolders = (subfolders) => (dispatch) => {
//   if (typeof subfolders === "object" && subfolders.length > 0) {
//     subfolders.forEach((x) => {
//       axios.patch(`/folders/${x.id}`, { index: x.index }).catch((err) => {
//         dispatch({
//           type: SET_ERRORS,
//           payload: err.response.data,
//         });
//       });
//     });
//   }
// };

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

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
