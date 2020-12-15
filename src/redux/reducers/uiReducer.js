import {
  // errors
  SET_ERROR,
  CLEAR_ERROR,
  CLEAR_ALL_ERRORS,
  // loading
  SET_LOADING_ACTION,
  STOP_LOADING_ACTION,
  LOADING_FOLDER_SEARCH,
  STOP_LOADING_FOLDER_SEARCH,
} from "../types";

const initialState = {
  loadingFolderSearch: false,
  loadingWhois: false,
  errors: {},
  loadingActions: {},
};

export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    // errors
    case SET_ERROR:
      let error = action.payload;
      console.log(error);
      return {
        ...state,
        loadingActions: {
          ...state.loadingActions,
          [error.actionName]: false,
        },
        errors: {
          ...state.errors,
          [error.actionName]: error.message,
        },
      };

    case CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload]: false,
        },
      };

    case CLEAR_ALL_ERRORS:
      return {
        ...state,
        errors: {},
        loadingActions: {},
      };

    // loading
    case SET_LOADING_ACTION:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload]: false,
        },
        loadingActions: {
          ...state.loadingActions,
          [action.payload]: true,
        },
      };

    case STOP_LOADING_ACTION:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload]: false,
        },
        loadingActions: {
          ...state.loadingActions,
          [action.payload]: false,
        },
      };

    case LOADING_FOLDER_SEARCH:
      return {
        ...state,
        // errors: [],
        loadingFolderSearch: true,
      };

    case STOP_LOADING_FOLDER_SEARCH:
      return {
        ...state,
        // errors: [],
        loadingFolderSearch: false,
      };
    default:
      return state;
  }
};
