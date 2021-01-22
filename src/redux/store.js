import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { userReducer } from "./reducers/userReducer";
import { announcementReducer } from "./reducers/announcementReducer";
import { calendarReducer } from "./reducers/calendarReducer";
import { contactReducer } from "./reducers/contactReducer";
import { folderReducer } from "./reducers/folderReducer";
import { newsletterReducer } from "./reducers/newsletterReducer";
import { uiReducer } from "./reducers/uiReducer";

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
  user: userReducer,
  announcements: announcementReducer,
  newsletters: newsletterReducer,
  contacts: contactReducer,
  folders: folderReducer,
  calendar: calendarReducer,
  ui: uiReducer,
});

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));
const store = createStore(reducers, initialState, enhancer);

export default store;
