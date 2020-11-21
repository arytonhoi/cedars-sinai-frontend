import {
  LOADING_DATA,
  STOP_LOADING_DATA,
  // Data Handling
  SET_DATA_ARRAY,
  SET_DATA,
  POST_DATA,
  DELETE_DATA,
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
  // POST_IMAGE,
  // Folders
  ADD_SUBFOLDER,
  PATCH_FOLDER,
  PATCH_SUBFOLDER,
  DELETE_SUBFOLDER,
  SORT_SUBFOLDER,
  SET_NAV_PATH,
  RESET_NAV_PATH,
  SET_FOLDER_SEARCH_RES,
} from "../types";

import DateHelper from "../../util/dateHelper";

const initialState = {
  loading: false,
  data: [],
  folderSearchRes: [],
  navpath: { id: "", parent: "", children: [] },
  announcements: [],
  filteredAnnouncements: [],
  departments: [],
  contacts: [],
  matchingSearchContacts: [],
  uploadedImageUrl: "",
};

var index;

// export functions
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
    // Announcements
    case SET_ANNOUNCEMENTS:
      const announcements = action.payload;
      announcements.forEach((a) => {
        a.createdAt = new DateHelper(a.createdAt);
        a.createdAtTimestamp = a.createdAt.getTimestamp();
        return a;
      });
      return {
        ...state,
        announcements: announcements,
        filteredAnnouncements: announcements,
        loading: false,
      };
    case POST_ANNOUNCEMENT:
      const newAnnouncement = action.payload;
      newAnnouncement.createdAt = new DateHelper(newAnnouncement.createdAt);
      newAnnouncement.createdAtTimestamp = newAnnouncement.createdAt.getTimestamp();
      const postedAnnouncements = [newAnnouncement, ...state.announcements];
      return {
        ...state,
        announcements: postedAnnouncements,
        filteredAnnouncements: postedAnnouncements,
        loading: false,
      };
    case PATCH_ANNOUNCEMENT:
      const updatedAnnouncement = action.payload;
      console.log(updatedAnnouncement);
      const updatedAnnouncements = state.announcements.map((a) => {
        if (a.id === updatedAnnouncement.id) {
          updatedAnnouncement.createdAt = a.createdAt;
          return updatedAnnouncement;
        } else {
          return a;
        }
      });
      console.log(updatedAnnouncements);
      return {
        ...state,
        announcements: updatedAnnouncements,
        filteredAnnouncements: updatedAnnouncements,
        loading: false,
      };
    case DELETE_ANNOUNCEMENT:
      const deletedAnnouncementId = action.payload;
      return {
        ...state,
        announcements: state.announcements.filter(
          (a) => a.id !== deletedAnnouncementId
        ),
        filteredAnnouncements: state.filteredAnnouncements.filter(
          (a) => a.id !== deletedAnnouncementId
        ),
        loading: false,
      };
    case FILTER_ANNOUNCEMENTS:
      const filters = action.payload;
      const announcementSearchTerm = filters.searchTerm;
      const oldestAnnouncementTimestamp = filters.oldestAnnouncementTimestamp;
      const now = new Date().getTime();
      return {
        ...state,
        filteredAnnouncements: state.announcements.filter(
          (a) =>
            now - a.createdAtTimestamp < oldestAnnouncementTimestamp &&
            (announcementSearchTerm.trim() === "" ||
              a.title
                .toLowerCase()
                .includes(announcementSearchTerm.trim().toLowerCase()) ||
              a.content
                .toLowerCase()
                .includes(announcementSearchTerm.trim().toLowerCase()))
        ),
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
    // Contacts
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
        matchingSearchContacts: [...state.contacts, action.payload],
        loading: false,
      };
    case PATCH_CONTACT:
      const updateContact = action.payload;
      const updatedPatchContacts = state.contacts.map((contact) =>
        contact.id === updateContact.id ? updateContact : contact
      );
      return {
        ...state,
        contacts: updatedPatchContacts,
        matchingSearchContacts: updatedPatchContacts,
        loading: false,
      };
    case DELETE_CONTACT:
      const deletedContactId = action.payload;
      const updatedDeleteContacts = state.contacts.filter(
        (contact) => contact.id !== deletedContactId
      );
      const updatedSearchDeleteContacts = state.matchingSearchContacts.filter(
        (contact) => contact.id !== deletedContactId
      );
      return {
        ...state,
        contacts: updatedDeleteContacts,
        matchingSearchContacts: updatedSearchDeleteContacts,
        loading: false,
      };
    case SEARCH_CONTACTS:
      const searchTerm = action.payload;
      return {
        ...state,
        matchingSearchContacts: state.contacts.filter((contact) =>
          contact.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
        ),
        loading: false,
      };
    // Folders
    case ADD_SUBFOLDER:
      state.data[0].subfolders.push(action.payload);
      return { ...state };
    case PATCH_FOLDER:
      state.data[0] = Object.assign(state.data[0], action.payload);
      return { ...state };
    case PATCH_SUBFOLDER:
      let sf = state.data[0].subfolders;
      index = sf.findIndex((x) => x.id === action.payload.id);
      if (action.payload.patch && index >= 0) {
        sf[index] = Object.assign(sf[index], action.payload.patch);
      }
      state.data[0].subfolders = sf;
      return { ...state };
    case DELETE_SUBFOLDER:
      sf = state.data[0].subfolders;
      index = sf.findIndex((x) => x.id === action.payload);
      state.data[0].subfolders = sf.slice(0, index).concat(sf.slice(index + 1));
      return { ...state };
    case SORT_SUBFOLDER:
      switch (parseInt(action.payload)) {
        case 0:
          state.data[0].subfolders.sort(
            (a, b) => a.title.toUpperCase() >= b.title.toUpperCase()
          );
          break;
        case 1:
          state.data[0].subfolders.sort(
            (a, b) => a.title.toUpperCase() < b.title.toUpperCase()
          );
          break;
        case 2:
          state.data[0].subfolders.sort((a, b) => a.createdAt < b.createdAt);
          break;
        case 3:
          state.data[0].subfolders.sort((a, b) => a.createdAt >= b.createdAt);
          break;
        case 4:
          state.data[0].subfolders.sort((a, b) => a.visits <= b.visits);
          break;
        default:
          state.data[0].subfolders.sort((a, b) => a.index >= b.index);
          break;
      }
      return { ...state };
    case SET_NAV_PATH:
      return {
        ...state,
        navpath: {
          id: action.payload.id,
          title: action.payload.title,
          parent: action.payload.parent,
          children: action.payload.subfolders,
        },
        loading: false,
      };
    case RESET_NAV_PATH:
      return {
        ...state,
        navpath: {
          id: state.data[0].id,
          title: state.data[0].title,
          parent: state.data[0].parent,
          children: state.data[0].subfolders,
        },
        loading: false,
      };
    case SET_FOLDER_SEARCH_RES:
      return {
        ...state,
        folderSearchRes: action.payload,
        loading: false,
      };
    // Data Handling
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
      index = state.data.findIndex((x) => x.postId === action.payload);
      state.data.splice(index, 1);
      return {
        ...state,
      };

    default:
      return state;
  }
}
