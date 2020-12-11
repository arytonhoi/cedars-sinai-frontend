import {
  LOADING_UI,
  LOADING_FOLDER_SEARCH,
  STOP_LOADING_UI,
  STOP_LOADING_FOLDER_SEARCH,
  SET_ERRORS,
  CLEAR_ERRORS,
} from "../types";

const initialState = {
  loading: false,
  loadingFolderSearch: false,
  loadingWhois: false,
  errors: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    // errors
    case SET_ERRORS:
      console.log(action.payload);
      return {
        ...state,
        errors: action.payload,
        loading: false,
      };
    case CLEAR_ERRORS:
      let actionName = action.payload;
      let updatedErrors = state.errors;
      if (updatedErrors[actionName]) {
        console.log(`Success: cleared ${actionName} errors`);
        delete updatedErrors[actionName];
      } else {
        console.log(`Warning: tried to clear nonexistent ${actionName} errors`);
      }

      return {
        ...state,
        errors: updatedErrors,
      };
    // loading
    case LOADING_UI:
      return {
        ...state,
        errors: {},
        loading: true,
      };
    case STOP_LOADING_UI:
      return {
        ...state,
        errors: {},
        loading: false,
      };
    case LOADING_FOLDER_SEARCH:
      return {
        ...state,
        errors: [],
        loadingFolderSearch: true,
      };
    case STOP_LOADING_FOLDER_SEARCH:
      return {
        ...state,
        errors: [],
        loadingFolderSearch: false,
      };
    default:
      return state;
  }
}
