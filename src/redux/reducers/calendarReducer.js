import {
  // calendar
  SET_EVENTS,
  // whois
  SET_WHOIS_DATA,
} from "../types";
import DateHelper from "../../util/dateHelper";

const initialState = {
  loading: false,
  // whois
  whois: {},
  // calendar events
  events: [],
};

// export functions
export const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    // Calendar
    case SET_EVENTS:
      return {
        ...state,
        events: action.payload.items.map((x) => {
          if (typeof x.start.date === "string") {
            x.start.dateTime = Date.parse(x.start.date);
          }
          if (typeof x.end.date === "string") {
            x.end.dateTime = Date.parse(x.end.date);
          }
          return {
            ...x,
            startTime: new DateHelper(x.start.dateTime),
            endTime: new DateHelper(x.end.dateTime),
          };
        }),
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
};
