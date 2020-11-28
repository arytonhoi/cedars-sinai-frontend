import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

// Styles
import "./App.css";
import "./css/text.css";
import { Layout } from "antd";

// Utils
import AuthRoute from "./util/jsx/AuthRoute";
import axios from "axios";

// Pages
import SideNav from "./components/layout/sideNav";
import genPage from "./pages/genPage";
import login from "./pages/login";
import logout from "./pages/logout";
import announcementPage from "./pages/announcementPage";
import contactPage from "./pages/contactPage";
import calendarPage from "./pages/calendarPage";

// axios.defaults.withCredentials = !(window.location.hostname === "localhost");
axios.defaults.withCredentials = true;
window.location.hostname === "localhost"
  ? (axios.defaults.baseURL = "http://localhost:5000/api")
  : (axios.defaults.baseURL = "/api");

// Authentication
const hasValidCookie = localStorage.hasValidCookie;
if (hasValidCookie) {
  try {
    store.dispatch({ type: SET_AUTHENTICATED });
    store.dispatch(getUserData());
  } catch (err) {
    console.log(err);
    store.dispatch(logoutUser());
  }
}

class App extends Component {
  render() {
    if (store.getState().user.authenticated) {
      return (
        <Provider store={store}>
          <Router>
            <Layout style={{ minHeight: "100vh" }}>
              <SideNav location={this.props.location} />
              <Layout className="site-layout">
                <Switch>
                  <AuthRoute exact path="/login" component={login} />
                  <Route exact path="/">
                    <Redirect to="/announcements" />
                  </Route>
                  <Route
                    exact
                    path="/announcements"
                    component={announcementPage}
                  />
                  <Route exact path="/resources" component={genPage} />
                  <Route exact path="/calendar" component={calendarPage} />
                  <Route exact path="/contacts" component={contactPage} />
                  <Route exact path="/logout" component={logout} />
                  <Route path="/resources/:pageName" component={genPage} />
                </Switch>
              </Layout>
            </Layout>
          </Router>
        </Provider>
      );
    } else {
      return (
        <Provider store={store}>
          <Router>
            <Route exact path="*">
              <Redirect to="/login" />
            </Route>
            <Route exact path="/login" component={login} />
          </Router>
        </Provider>
      );
    }
  }
}

export default App;
