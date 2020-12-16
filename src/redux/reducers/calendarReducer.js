import {
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

// export functions
export default function (state = initialState, action) {
  switch (action.type) {
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
