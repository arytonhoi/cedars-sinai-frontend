import {
  LOADING_UI,
  LOADING_FOLDER_SEARCH,
  STOP_LOADING_UI,
  STOP_LOADING_FOLDER_SEARCH,

  SET_ERRORS,
  CLEAR_ERRORS,
} from '../types';

const initialState = {
  loading: false,
  loadingFolderSearch: false,
  errors: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      if(typeof(action.payload.general)==="undefined" &&
         typeof(action.payload.error)!=="undefined"){
        state.errors.push({"general":action.payload.error})
      }else{
        state.errors.push(action.payload)
      }
      return {
        ...state,
        loading: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        errors: [],
        loading: false,
      };
    case LOADING_UI:
      return {
        ...state,
        errors: [],
        loading: true
      };
    case STOP_LOADING_UI:
      return {
        ...state,
        errors: [],
        loading: false
      };
    case LOADING_FOLDER_SEARCH:
      return {
        ...state,
        errors: [],
        loadingFolderSearch: true
      };
    case STOP_LOADING_FOLDER_SEARCH:
      return {
        ...state,
        errors: [],
        loadingFolderSearch: false
      };
    default:
      return state;
  }
}
