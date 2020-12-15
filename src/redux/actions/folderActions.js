import {
  // Errors
  SET_ERROR,
  CLEAR_ERROR,
  // Folders
  SET_FOLDER,
  POST_FOLDER,
  PATCH_FOLDER,
  PATCH_SUBFOLDER,
  SORT_SUBFOLDER,
  DELETE_SUBFOLDER,
  // Folder nav
  SET_NAV_PATH,
  RESET_NAV_PATH,
  // Folder search
  SET_FOLDER_SEARCH_RES,
} from "../types";
import axios from "axios";

// React
import React from "react";

// antd
import { notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// Folders
export const getFolder = (folderId, track) => (dispatch) => {
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
    })
    .catch((err) => dispatch({ type: SET_ERROR, payload: err }));
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
      //   type: SET_ERROR,
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
  //     type: SET_ERROR,
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
      //   type: SET_ERROR,
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
      //   type: SET_ERROR,
      //   payload: err.response.data,
      // });
    });
};

// export const syncAllSubFolders = (subfolders) => (dispatch) => {
//   if (typeof subfolders === "object" && subfolders.length > 0) {
//     subfolders.forEach((x) => {
//       axios.patch(`/folders/${x.id}`, { index: x.index }).catch((err) => {
//         dispatch({
//           type: SET_ERROR,
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
      //   type: SET_ERROR,
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
        .catch((err) => dispatch({ type: SET_ERROR, payload: err }));
};

export const searchFolder = (searchKey) => (dispatch) => {
  axios
    .get(`/folders/search/${searchKey}`)
    .then((res) => {
      dispatch({
        type: SET_FOLDER_SEARCH_RES,
        payload: res.data,
      });
    })
    .catch((err) => dispatch({ type: SET_ERROR, payload: err }));
};
