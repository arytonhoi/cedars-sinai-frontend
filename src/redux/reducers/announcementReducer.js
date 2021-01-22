import {
  // Images
  GET_BANNER_IMAGE,
  PATCH_BANNER_IMAGE,
  // Announcements
  SET_ANNOUNCEMENTS,
  POST_ANNOUNCEMENT,
  PATCH_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  FILTER_ANNOUNCEMENTS,
} from "../types";

import DateHelper from "../../util/dateHelper";

const loadingBannerImgUrl = `https://firebasestorage.googleapis.com/v0/b/fir-db-d2d47.appspot.com/o/
1608346433293_237616441801.png?alt=media&token=8370797b-7650-49b7-8b3a-9997fab0c32c`;

const initialState = {
  // announcements
  announcements: [],
  filteredAnnouncements: [],
  bannerImgs: {
    announcements: loadingBannerImgUrl,
  },
};

// export functions
export const announcementReducer = (state = initialState, action) => {
  switch (action.type) {
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
      };
    case PATCH_ANNOUNCEMENT:
      const updatedAnnouncement = action.payload;
      const updatedAnnouncements = state.announcements.map((a) => {
        if (a.id === updatedAnnouncement.id) {
          updatedAnnouncement.createdAt = a.createdAt;
          return updatedAnnouncement;
        } else {
          return a;
        }
      });
      return {
        ...state,
        announcements: updatedAnnouncements,
        filteredAnnouncements: updatedAnnouncements,
      };
    case DELETE_ANNOUNCEMENT:
      const deletedAnnouncementId = action.payload;
      return {
        ...state,
        announcements: state.announcements.filter((a) => a.id !== deletedAnnouncementId),
        filteredAnnouncements: state.filteredAnnouncements.filter(
          (a) => a.id !== deletedAnnouncementId
        ),
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
              a.title.toLowerCase().includes(announcementSearchTerm.trim().toLowerCase()) ||
              a.content.toLowerCase().includes(announcementSearchTerm.trim().toLowerCase()))
        ),
      };
    default:
      return state;
  }
};
