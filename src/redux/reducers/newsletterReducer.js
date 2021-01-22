import {
  // Newsletters
  SET_NEWSLETTERS,
  POST_NEWSLETTER,
  PATCH_NEWSLETTER,
  DELETE_NEWSLETTER,
} from "../types";

import DateHelper from "../../util/dateHelper";

const initialState = {
  newsletters: [],
};

// export functions
export const newsletterReducer = (state = initialState, action) => {
  switch (action.type) {
    // Newsletters
    case SET_NEWSLETTERS:
      const newsletters = action.payload;
      newsletters.forEach((n) => {
        n.createdAt = new DateHelper(n.createdAt);
        n.createdAtTimestamp = n.createdAt.getTimestamp();
        return n;
      });
      return {
        ...state,
        newsletters: newsletters,
      };

    case POST_NEWSLETTER:
      const newNewsletter = action.payload;
      newNewsletter.createdAt = new DateHelper(newNewsletter.createdAt);
      newNewsletter.createdAtTimestamp = newNewsletter.createdAt.getTimestamp();
      return {
        ...state,
        newsletters: [newNewsletter, ...state.newsletters],
      };

    case PATCH_NEWSLETTER:
      const updatedNewsletter = action.payload;
      const updatedNewsletters = state.newsletters.map((n) => {
        if (n.id === updatedNewsletter.id) {
          updatedNewsletter.createdAt = n.createdAt;
          return updatedNewsletter;
        } else {
          return n;
        }
      });
      return {
        ...state,
        newsletters: updatedNewsletters,
      };

    case DELETE_NEWSLETTER:
      const deletedNewsletterId = action.payload;
      return {
        ...state,
        newsletters: state.newsletters.filter((n) => n.id !== deletedNewsletterId),
      };

    default:
      return state;
  }
};
