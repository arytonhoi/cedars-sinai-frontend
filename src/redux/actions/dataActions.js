import {
  //UI
  LOADING_UI,
  STOP_LOADING_UI,
  LOADING_FOLDER_SEARCH,
  STOP_LOADING_FOLDER_SEARCH,
  //STOP_LOADING_UI,
  LOADING_DATA,
  //STOP_LOADING_DATA,
  // Errors
  SET_ERRORS,
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

// React
import React from "react";

// antd
import { notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

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
  dispatch({ type: LOADING_UI });
  return axios
    .get("/announcements")
    .then((res) => {
      dispatch({
        type: SET_ANNOUNCEMENTS,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      dispatch({
        type: SET_ANNOUNCEMENTS,
        payload: [],
      });
      dispatch({ type: STOP_LOADING_UI });
    });
};

export const postAnnouncement = (newAnnouncement) => (dispatch) => {
  axios
    .post("/announcements", newAnnouncement)
    .then((res) => {
      dispatch({
        type: POST_ANNOUNCEMENT,
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

export const patchAnnouncement = (
  updatedAnnnouncementId,
  updatedAnnnouncement
) => (dispatch) => {
  axios
    .patch(`/announcements/${updatedAnnnouncementId}`, updatedAnnnouncement)
    .then((res) => {
      updatedAnnnouncement.id = updatedAnnnouncementId;
      dispatch({
        type: PATCH_ANNOUNCEMENT,
        payload: updatedAnnnouncement,
      });
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
  axios
    .post("/departments", newDepartment)
    .then((res) => {
      dispatch({
        type: POST_DEPARTMENT,
        payload: res.data,
      });
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
  axios
    .patch(`/departments/${updatedDepartmentId}`, updatedDepartment)
    .then((res) => {
      updatedDepartment.id = updatedDepartmentId;
      dispatch({
        type: PATCH_DEPARTMENT,
        payload: updatedDepartment,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const deleteDepartment = (departmentId) => (dispatch) => {
  axios
    .delete(`/departments/${departmentId}`)
    .then((res) => {
      dispatch({
        type: DELETE_DEPARTMENT,
        payload: departmentId,
      });
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
  axios
    .post("/contacts", newContact)
    .then((res) => {
      dispatch({
        type: POST_CONTACT,
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

export const patchContact = (updatedContactId, updatedContact) => (
  dispatch
) => {
  axios
    .patch(`/contacts/${updatedContactId}`, updatedContact)
    .then((res) => {
      updatedContact.id = updatedContactId;
      dispatch({
        type: PATCH_CONTACT,
        payload: updatedContact,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const deleteContact = (contactId) => (dispatch) => {
  axios
    .delete(`/contacts/${contactId}`)
    .then((res) => {
      dispatch({
        type: DELETE_CONTACT,
        payload: contactId,
      });
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
export const getFolder = (folderId, track) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(
      `/folders/${folderId}?${
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
      dispatch({
        type: STOP_LOADING_UI,
      });
    })
    .catch((err) => dispatch({ type: SET_ERRORS, payload: err }));
};

export const postFolder = (folderId, folderDetails) => (dispatch) => {
  notification.open({
    key: "loading",
    duration: 0,
    message: "Creating folder...",
    icon: <LoadingOutlined />,
  });
  axios
    .post(`/folders/${folderId}`, folderDetails)
    .then((res) => {
      dispatch({
        type: POST_FOLDER,
        payload: res.data,
      });
      notification.close("loading");
      notification["success"]({
        message: "Success!",
        description: "Folder created successfully",
      });
    })
    .catch((err) => {
      // dispatch({
      //   type: SET_ERRORS,
      //   payload: err.response.data,
      // });
      let error = err.response.data;
      console.log(error);
      notification.close("loading");
      notification["error"]({
        duration: 0,
        message: "Error!",
        description: error.message,
      });
    });
};

export const patchFolder = (folderId, updatedFolder) => (dispatch) => {
  // if (folderId === updatedFolder.parent) {
  //   dispatch({
  //     type: SET_ERRORS,
  //     payload: { error: "Cannot move folder into itself." },
  //   });
  // } else {
  updatedFolder.lastModified = new Date().toISOString();
  notification.open({
    key: "loading",
    duration: 0,
    message: "Updating folder...",
    icon: <LoadingOutlined />,
  });
  axios
    .patch(`/folders/${folderId}`, updatedFolder)
    .then((res) => {
      dispatch({
        type: PATCH_FOLDER,
        payload: updatedFolder,
      });
      notification.close("loading");
      notification["success"]({
        message: "Success!",
        description: "Folder updated successfully",
      });
    })
    .catch((err) => {
      // dispatch({
      //   type: SET_ERRORS,
      //   payload: err.response.data,
      // });
      let error = err.response.data;
      console.log(error);
      notification.close("loading");
      notification["error"]({
        duration: 0,
        message: "Error!",
        description: error.message,
      });
    });
};

export const patchSubfolder = (folderId, updatedFolder) => (dispatch) => {
  updatedFolder.lastModified = new Date().toISOString();
  notification.open({
    key: "loading",
    duration: 0,
    message: "Updating folder...",
    icon: <LoadingOutlined />,
  });
  axios
    .patch(`/folders/${folderId}`, updatedFolder)
    .then((res) => {
      dispatch({
        type: PATCH_SUBFOLDER,
        payload: { id: folderId, patch: updatedFolder },
      });
      notification.close("loading");
      notification["success"]({
        message: "Success!",
        description: "Folder updated successfully",
      });
    })
    .catch((err) => {
      let error = err.response.data;
      console.log(error);
      notification.close("loading");
      notification["error"]({
        duration: 0,
        message: "Error!",
        description: error.message,
      });
      // dispatch({
      //   type: SET_ERRORS,
      //   payload: err.response.data,
      // });
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

export const deleteFolder = (folderId) => (dispatch) => {
  notification.open({
    key: "loading",
    duration: 0,
    message: "Deleting folder...",
    icon: <LoadingOutlined />,
  });
  axios
    .delete(`/folders/${folderId}`)
    .then((res) => {
      dispatch({
        type: DELETE_SUBFOLDER,
        payload: folderId,
      });
      notification.close("loading");
      notification["success"]({
        message: "Success!",
        description: "Folder deleted successfully",
      });
    })
    .catch((err) => {
      // dispatch({
      //   type: SET_ERRORS,
      //   payload: err.response.data,
      // });
      let error = err.response.data;
      console.log(error);
      notification.close("loading");
      notification["error"]({
        duration: 0,
        message: "Error!",
        description: error.message,
      });
    });
};

export const getNavRoute = (folderId) => (dispatch) => {
  typeof folderId === "undefined"
    ? dispatch({ type: RESET_NAV_PATH })
    : axios
        .get(`/folders/${folderId}`)
        .then((res) => {
          dispatch({
            type: SET_NAV_PATH,
            payload: res.data,
          });
        })
        .catch((err) => dispatch({ type: SET_ERRORS, payload: err }));
};

export const searchFolder = (searchKey) => (dispatch) => {
  dispatch({
    // type: LOADING_FOLDER_SEARCH,
    type: LOADING_UI,
  });
  axios
    .get(`/folders/search/${searchKey}`)
    .then((res) => {
      dispatch({
        type: SET_FOLDER_SEARCH_RES,
        payload: res.data,
      });
      dispatch({
        // type: STOP_LOADING_FOLDER_SEARCH,
        type: STOP_LOADING_UI,
      });
    })
    .catch((err) => dispatch({ type: SET_ERRORS, payload: err }));
};
