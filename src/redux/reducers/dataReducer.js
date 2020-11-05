import {
  LOADING_DATA,
  STOP_LOADING_DATA,

  SET_DATA_ARRAY,
  SET_DATA,
  POST_DATA,
  DELETE_DATA,

  SET_ANNOUNCE,
  POST_ANNOUNCE,
  DELETE_ANNOUNCE,

  SET_CONTACTS,
} from "../types";

const initialState = {
  data: [],
  announcements: [],
  contacts: [],
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING_DATA:
      return {
        ...state,
        loading: false,
      };
    // announcements
    case SET_ANNOUNCE:
      return {
        ...state,
        announcements: action.payload,
        loading: false,
      };
    case POST_ANNOUNCE:
      return {
        ...state,
        announcements: [action.payload, ...state.announcements],
        loading: false,
      };
    case DELETE_ANNOUNCE:
      index = state.announcements.findIndex(
        (x) => x.announcementId === action.payload
      );
      state.announcements.splice(index, 1);
      return {
        ...state,
      };
    // contacts
    case SET_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
        loading: false,
      };
    case SET_DATA_ARRAY:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };

    case SET_DATA:
      return {
        ...state,
        data: [action.payload],
        loading: false,
      };
    case POST_DATA:
      return {
        ...state,
        data: [action.payload, ...state.data],
      };
    case DELETE_DATA:
      let index = state.data.findIndex((x) => x.postId === action.payload);
      state.data.splice(index, 1);
      return {
        ...state,
      };

    default:
      return state;
  }
}
