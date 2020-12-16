import {
  //UI
  LOADING_UI,
  STOP_LOADING_UI,
  LOADING_WHOIS,
  STOP_LOADING_WHOIS,
  SET_EVENTS,
  // Whois
  SET_WHOIS_DATA,
} from "../types";
import axios from "axios";
import { setError } from "./uiActions";

export const getCalendarEvents = (from, to) => (dispatch) => {
  dispatch({
    type: LOADING_UI,
  });
  axios
    .get(`/calendar/cedarsoreducation@gmail.com/?from=${from}&to=${to}`)
    .then((res) => {
      dispatch({
        type: SET_EVENTS,
        payload: res.data,
      });
      dispatch({
        type: STOP_LOADING_UI,
      });
    })
    .catch((err) => {
      dispatch(setError(SET_EVENTS, err.response.data));
    });
};

// Misc
export const getWhois = () => (dispatch) => {
  dispatch({
    type: LOADING_WHOIS,
  });
  axios
    .get(`/whois`)
    .then((res) => {
      res.data.status === "success"
        ? dispatch({
            type: SET_WHOIS_DATA,
            payload: res.data,
          })
        : dispatch(setError(SET_EVENTS, res.data));
      dispatch({
        type: STOP_LOADING_WHOIS,
      });
    })
    .catch((err) => dispatch(setError(SET_EVENTS, err.response.data)));
};
