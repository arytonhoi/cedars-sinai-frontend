import {
  // loading
  LOADING_DATA,
  STOP_LOADING_DATA,
  // Images
  GET_BANNER_IMAGE,
  PATCH_BANNER_IMAGE,
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
  SET_FOLDER,
  POST_FOLDER,
  PATCH_FOLDER,
  PATCH_SUBFOLDER,
  DELETE_SUBFOLDER,
  SORT_SUBFOLDER,
  MOVE_SUBFOLDER,
  SET_NAV_PATH,
  RESET_NAV_PATH,
  SET_FOLDER_SEARCH_RES,
  // calendar
  SET_EVENTS,
  // whois
  SET_WHOIS_DATA,
} from "../types";

import DateHelper from "../../util/dateHelper";

const loadingBannerImgUrl = `https://firebasestorage.googleapis.com/v0/b/fir-db-d2d47.appspot.com/o/
cedars_sinai_pic_1.png?alt=media&token=8370797b-7650-49b7-8b3a-9997fab0c32c`;

const initialState = {
  loading: false,
  // images
  uploadedImageUrl: "",
  // announcements
  announcements: [],
  filteredAnnouncements: [],
  bannerImgs: {
    announcements: loadingBannerImgUrl,
  },
  // contacts
  departments: [],
  contacts: [],
  matchingSearchContacts: [],
  // whois
  whois: {},
  // calendar events
  calendar: [],
  // folders
  folder: {
    index: 0,
    id: "",
    title: "",
    parent: "",
    content: "",
    visits: 0,
    defaultSubfolderSort: -1,
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
    // Images
    case GET_BANNER_IMAGE:
      let bannerImgObj = action.payload;
      let updatedBannerImgs = state.bannerImgs;
      updatedBannerImgs[bannerImgObj.pageName] = bannerImgObj.imgUrl;
      return {
        ...state,
        bannerImgs: updatedBannerImgs,
      };

    case PATCH_BANNER_IMAGE:
      bannerImgObj = action.payload;
      updatedBannerImgs = state.bannerImgs;
      updatedBannerImgs[bannerImgObj.pageName] = bannerImgObj.imgUrl;
      return {
        ...state,
        bannerImgs: updatedBannerImgs,
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
    case SET_FOLDER:
      return {
        ...state,
        folder: action.payload,
        loading: false,
      };
    case POST_FOLDER:
      state.folder.subfolders.push(action.payload);
      return { ...state };
    case PATCH_FOLDER:
      return {
        ...state,
        folder: action.payload,
        loading: false,
      };
    case PATCH_SUBFOLDER:
      let sf = state.folder.subfolders;
      index = sf.findIndex((x) => x.id === action.payload.id);
      if (action.payload.patch && index >= 0) {
        sf[index] = Object.assign(sf[index], action.payload.patch);
      }
      state.folder.subfolders = sf;
      return { ...state };
    case DELETE_SUBFOLDER:
      sf = state.folder.subfolders;
      index = sf.findIndex((x) => x.id === action.payload);
      state.folder.subfolders = sf.slice(0, index).concat(sf.slice(index + 1));
      return { ...state };
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
    case MOVE_SUBFOLDER:
      sf = state.folder.subfolders;
      let oldIndex = sf.findIndex((x) => x.id === action.payload.id);
      if (oldIndex >= 0) {
        let newIndex = Math.min(
          Math.max(0, action.payload.newIndex),
          sf.length
        );
        sf = sf.slice(0, oldIndex).concat(sf.slice(oldIndex + 1));
        sf = sf
          .slice(0, newIndex)
          .concat(state.folder.subfolders[oldIndex])
          .concat(sf.slice(newIndex));
        state.folder.subfolders = sf.map((x, i) =>
          Object.assign(x, { index: i })
        );
      }
      return { ...state };
    case SET_NAV_PATH:
      return {
        ...state,
        moveFolderModalCurrentPath: {
          movingFolderId: action.payload.id,
          title: action.payload.title,
          destinationFolderId: action.payload.parent,
          destinationFolderChildren: action.payload.subfolders,
        },
        loading: false,
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
        loading: false,
      };
    case SET_FOLDER_SEARCH_RES:
      return {
        ...state,
        folderSearchResults: action.payload,
        loading: false,
      };
    // Calendar
    case SET_EVENTS:
      return {
        ...state,
        events: action.payload,
        loading: false,
      };
    // Whois
    case SET_WHOIS_DATA:
      return {
        ...state,
        whois: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
