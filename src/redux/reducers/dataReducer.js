import {
  LOADING_DATA,
  STOP_LOADING_DATA,
  SET_POSTS,
  SET_POST,
  SET_ANNOUNCE,
  POST_ANNOUNCE,
  POST_POST,
  DELETE_POST,
  DELETE_ANNOUNCE,
  SET_CONTACTS,
} from "../types";

const initialState = {
  posts: [],
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
    case SET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false,
      };

    case SET_POST:
      return {
        ...state,
        posts: [action.payload],
        loading: false,
      };
    case POST_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case DELETE_POST:
      let index = state.posts.findIndex((x) => x.postId === action.payload);
      state.posts.splice(index, 1);
      return {
        ...state,
      };

    default:
      return state;
  }
}
