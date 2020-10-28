import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import JWT from "./util/jwt.js";
// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED, SET_ADMIN } from "./redux/types";
import { logoutUser } from "./redux/actions/userActions";
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

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = new JWT(token).parse.payload;
  console.log(decodedToken);
  //console.log(decodedToken.verify())
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    if (decodedToken.email === "admin@email.com") {
      store.dispatch({ type: SET_ADMIN });
    }
    axios.defaults.headers.common["Authorization"] = token;
  }
}
console.log(store.getState());

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
                  <Route exact path="/" component={home} />
                  <Route
                    exact
                    path="/announcements"
                    component={announcementPage}
                  />
                  {/* <Route exact path="/resources" component={home} /> */}
                  {/* <Route exact path="/calendar" component={home} /> */}
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

/*
                <Route exact path="/:handle" component={user} />
                <Route
                  exact
                  path="/:handle/scream/:screamId"
                  component={user}
                />
*/
