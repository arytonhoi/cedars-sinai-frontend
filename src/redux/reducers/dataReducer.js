import {
  LOADING_DATA,
  STOP_LOADING_DATA,
  // posts
  SET_POST,
  SET_POSTS,
  POST_POST,
  DELETE_POST,
  // announcements
  SET_ANNOUNCEMENTS,
  POST_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  // departments
  SET_DEPARTMENTS,
  PATCH_DEPARTMENT,
  POST_DEPARTMENT,
  DELETE_DEPARTMENT,
  // contacts
  SET_CONTACTS,
  PATCH_CONTACT,
  POST_CONTACT,
  DELETE_CONTACT,
  SEARCH_CONTACTS,
} from "../types";

const initialState = {
  posts: [],
  announcements: [],
  departments: [],
  contacts: [],
  matchingSearchContacts: [],
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
    case SET_ANNOUNCEMENTS:
      return {
        ...state,
        announcements: action.payload,
        loading: false,
      };
    case POST_ANNOUNCEMENT:
      return {
        ...state,
        announcements: [action.payload, ...state.announcements],
        loading: false,
      };
    case DELETE_ANNOUNCEMENT:
      index = state.announcements.findIndex(
        (x) => x.announcementId === action.payload
      );
      state.announcements.splice(index, 1);
      return {
        ...state,
      };
    // departments
    case SET_DEPARTMENTS:
      return {
        ...state,
        departments: action.payload,
        loading: false,
      };
    case POST_DEPARTMENT:
      return {
        ...state,
        departments: [...state.departments, action.payload],
        loading: false,
      };
    case PATCH_DEPARTMENT:
      const updatedDepartment = action.payload;
      return {
        ...state,
        departments: state.departments.map((department) =>
          department.id === updatedDepartment.id
            ? updatedDepartment
            : department
        ),
        loading: false,
      };
    case DELETE_DEPARTMENT:
      const deletedDepartmentId = action.payload;
      return {
        ...state,
        departments: state.departments.filter(
          (department) => department.id !== deletedDepartmentId
        ),
        loading: false,
      };
    // contacts
    case SET_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
        matchingSearchContacts: action.payload,
        loading: false,
      };
    case POST_CONTACT:
      return {
        ...state,
        contacts: [...state.contacts, action.payload],
        loading: false,
      };
    case PATCH_CONTACT:
      const updateContact = action.payload;
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.id === updateContact.id ? updateContact : contact
        ),
        loading: false,
      };
    case DELETE_CONTACT:
      const deletedContactId = action.payload;
      return {
        ...state,
        contacts: state.contacts.filter(
          (contact) => contact.id !== deletedContactId
        ),
        loading: false,
      };
    case SEARCH_CONTACTS:
      const searchTerm = action.payload;
      const matchingSearchContacts = state.contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );

      return {
        ...state,
        matchingSearchContacts: matchingSearchContacts,
        loading: false,
      };
    // POSTS??
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
