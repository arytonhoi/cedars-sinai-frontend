import {
  SET_FOLDER,
  POST_FOLDER,
  PATCH_FOLDER,
  PATCH_SUBFOLDER,
  DELETE_SUBFOLDER,
  SORT_SUBFOLDER,
  // MOVE_SUBFOLDER,
  SET_NAV_PATH,
  RESET_NAV_PATH,
  SET_FOLDER_SEARCH_RESULTS,
} from "../types";

const initialState = {
  // folders
  folder: {
    id: "",
    title: "",
    parent: "",
    content: "",
    visits: 0,
    defaultSubfolderSort: null,
    lastModified: "",
    createdAt: "",
    subfolders: [],
    path: [],
  },
  folderSearchResults: [],
  moveFolderModalCurrentPath: {
    movingFolderId: "",
    destinationFolderId: "",
    destinationFolderChildren: [],
  },
};

// export functions
export const folderReducer = (state = initialState, action) => {
  switch (action.type) {
    // Folders
    case SET_FOLDER:
      return {
        ...state,
        folder: action.payload,
      };

    case POST_FOLDER:
      state.folder.subfolders.push(action.payload);
      return { ...state };

    case PATCH_FOLDER:
      let folderUpdates = action.payload;
      let updatedFolder = state.folder;
      Object.keys(folderUpdates).forEach((key) => {
        updatedFolder[key] = folderUpdates[key];
      });

      return {
        ...state,
        folder: {
          ...state.folder,
          content: updatedFolder.content,
        },
      };

    case PATCH_SUBFOLDER:
      let updatedSubfolder = action.payload;
      return {
        ...state,
        folder: {
          ...state.folder,
          subfolders: state.folder.subfolders.map((folder) =>
            folder.id === updatedSubfolder.id ? updatedSubfolder : folder
          ),
        },
      };

    case DELETE_SUBFOLDER:
      let deletedSubfolderId = action.payload;
      return {
        ...state,
        folder: {
          ...state.folder,
          subfolders: state.folder.subfolders.filter(
            (folder) => folder.id !== deletedSubfolderId
          ),
        },
      };
    // sorting folders
    case SORT_SUBFOLDER:
      switch (action.payload) {
        case "most_popular":
          state.folder.subfolders.sort((a, b) =>
            a.visits <= b.visits ? 1 : -1
          );
          break;
        case "last_modified":
          state.folder.subfolders.sort((a, b) =>
            a.lastModified < b.lastModified ? 1 : -1
          );
          break;
        case "most_recently_added":
          state.folder.subfolders.sort((a, b) =>
            a.createdAt < b.createdAt ? 1 : -1
          );
          break;
        case "least_recently_added":
          state.folder.subfolders.sort((a, b) =>
            a.createdAt >= b.createdAt ? 1 : -1
          );
          break;
        default:
        case "alphabetical":
          state.folder.subfolders.sort((a, b) =>
            a.title.toUpperCase() >= b.title.toUpperCase() ? 1 : -1
          );
          break;
      }
      return { ...state };
    // moving folders
    // case MOVE_SUBFOLDER:
    //   sf = state.folder.subfolders;
    //   let oldIndex = sf.findIndex((x) => x.id === action.payload.id);
    //   if (oldIndex >= 0) {
    //     let newIndex = Math.min(
    //       Math.max(0, action.payload.newIndex),
    //       sf.length
    //     );
    //     sf = sf.slice(0, oldIndex).concat(sf.slice(oldIndex + 1));
    //     sf = sf
    //       .slice(0, newIndex)
    //       .concat(state.folder.subfolders[oldIndex])
    //       .concat(sf.slice(newIndex));
    //     state.folder.subfolders = sf.map((x, i) =>
    //       Object.assign(x, { index: i })
    //     );
    //   }
    //   return { ...state };
    case SET_NAV_PATH:
      return {
        ...state,
        moveFolderModalCurrentPath: {
          movingFolderId: action.payload.id,
          title: action.payload.title,
          destinationFolderId: action.payload.parent,
          destinationFolderChildren: action.payload.subfolders,
        },
      };
    case RESET_NAV_PATH:
      return {
        ...state,
        moveFolderModalCurrentPath: {
          movingFolderId: state.folder.id,
          title: state.folder.title,
          destinationFolderId: state.folder.parent,
          destinationFolderChildren: state.folder.subfolders,
        },
      };
    case SET_FOLDER_SEARCH_RESULTS:
      return {
        ...state,
        folderSearchResults: action.payload,
      };
    default:
      return state;
  }
};
