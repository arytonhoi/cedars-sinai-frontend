import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import JWT from "./util/jwt.js";
// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";
// Components
import Sidebar from "./components/layout/Sidebar";
import themeObject from "./util/configs/theme";
import AuthRoute from "./util/jsx/AuthRoute";
// Pages
import home from "./pages/home";
import genpage from "./pages/genPage";
import login from "./pages/login";
import logout from "./pages/logout";

import axios from "axios";
import announcementPage from "./pages/announcementPage";
import contactPage from "./pages/contactPage";

const theme = createMuiTheme(themeObject);

axios.defaults.baseURL =
  "https://us-central1-fir-db-d2d47.cloudfunctions.net/api";
  // "http://localhost:5000/fir-db-d2d47/us-central1/api";

// Authentication
const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = new JWT(token).parse.payload;
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}
// console.log(store.getState());

class App extends Component {
  render() {
    if (store.getState().user.authenticated) {
      return (
        <MuiThemeProvider theme={theme}>
          <Provider store={store}>
            <Router>
              <Sidebar />
              <div className="container">
                <Switch>
                  <AuthRoute exact path="/login" component={login} />
                  <Route exact path="/" component={announcementPage} />
                  <Route
                    exact
                    path="/announcements"
                    component={announcementPage}
                  />
                  <Route exact path="/resources" component={announcementPage} />
                  <Route exact path="/calendar" component={announcementPage} />
                  <Route exact path="/contacts" component={contactPage} />
                  <Route exact path="/logout" component={logout} />
                  <Route path="/:pageName" component={genpage} />
                </Switch>
              </div>
            </Router>
          </Provider>
        </MuiThemeProvider>
      );
    } else {
      return (
        <MuiThemeProvider theme={theme}>
          <Provider store={store}>
            <Router>
              <div className="container">
                <Route component={login} />
              </div>
            </Router>
          </Provider>
        </MuiThemeProvider>
      );
    }
  }
}

export default App;