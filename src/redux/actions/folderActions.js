import {
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
  SET_FOLDER_SEARCH_RESULTS,
} from "../types";

import { setError, setLoadingAction, stopLoadingAction } from "./uiActions";

import axios from "axios";

// Folders
export const getFolder = (folderId, track) => (dispatch) => {
  dispatch(setLoadingAction(SET_FOLDER));
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
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(SET_FOLDER));
    })
    .catch((err) => dispatch(setError(SET_FOLDER, err.response.data)));
};

export const postFolder = (folderId, folderDetails) => (dispatch) => {
  dispatch(setLoadingAction(POST_FOLDER));
  axios
    .post(`/folders/${folderId}`, folderDetails)
    .then((res) => {
      dispatch({
        type: POST_FOLDER,
        payload: res.data,
      });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(POST_FOLDER));
    })
    .catch((err) => {
      dispatch(setError(POST_FOLDER, err.response.data));
    });
};

export const patchFolder = (folderId, updatedFolder) => (dispatch) => {
  dispatch(setLoadingAction(PATCH_FOLDER));
  // updatedFolder.lastModified = new Date().toISOString();
  axios
    .patch(`/folders/${folderId}`, updatedFolder)
    .then((res) => {
      dispatch({
        type: PATCH_FOLDER,
        payload: updatedFolder,
      });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(PATCH_FOLDER));
    })
    .catch((err) => {
      dispatch(setError(PATCH_FOLDER, err.response.data));
    });
};

export const patchSubfolder = (folderId, updatedFolder) => (dispatch) => {
  dispatch(setLoadingAction(PATCH_SUBFOLDER));
  // updatedFolder.lastModified = new Date().toISOString();
  axios
    .patch(`/folders/${folderId}`, updatedFolder)
    .then((res) => {
      dispatch({
        type: PATCH_SUBFOLDER,
        payload: { id: folderId, patch: updatedFolder },
      });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(PATCH_SUBFOLDER));
    })
    .catch((err) => {
      dispatch(setError(PATCH_SUBFOLDER, err.response.data));
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
  dispatch(setLoadingAction(DELETE_SUBFOLDER));
  axios
    .delete(`/folders/${folderId}`)
    .then((res) => {
      dispatch({
        type: DELETE_SUBFOLDER,
        payload: folderId,
      });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(DELETE_SUBFOLDER));
    })
    .catch((err) => {
      dispatch(setError(DELETE_SUBFOLDER, err.response.data));
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
        .catch((err) => {
          dispatch(setError(SET_NAV_PATH, err.response.data));
        });
};

export const searchFolder = (searchKey) => (dispatch) => {
  dispatch(setLoadingAction(SET_FOLDER_SEARCH_RESULTS));
  axios
    .get(`/folders/search/${searchKey}`)
    .then((res) => {
      dispatch({
        type: SET_FOLDER_SEARCH_RESULTS,
        payload: res.data,
      });
      return res;
    })
    .then(() => {
      dispatch(stopLoadingAction(SET_FOLDER_SEARCH_RESULTS));
    })
    .catch((err) => {
      dispatch(setError(SET_FOLDER_SEARCH_RESULTS, err.response.data));
    });
};
