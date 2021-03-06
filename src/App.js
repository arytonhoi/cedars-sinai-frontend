import React, { Component } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

// Styles
import "./App.css";
import { Layout } from "antd";

// Utils
import AuthRoute from "./util/jsx/AuthRoute";
import axios from "axios";

// Pages
import AdminPage from "./pages/adminPage";
import announcementPage from "./pages/announcementPage";
import BackdoorLoginPage from "./pages/backdoorLoginPage";
import newsletterPage from "./pages/newsletterPage";
import calendarPage from "./pages/calendarPage";
import contactPage from "./pages/contactPage";
import FolderPage from "./pages/folderPage";
import LoginPage from "./pages/loginPage";
import logout from "./pages/logout";
import SearchPage from "./pages/searchPage";
import SideNav from "./components/layout/sideNav";

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
                  <AuthRoute exact path="/login" component={LoginPage} />
                  <AuthRoute exact path="/backdoorlogin" component={BackdoorLoginPage} />
                  <Route exact path="/">
                    <Redirect to="/announcements" />
                  </Route>
                  <Route exact path="/announcements" component={announcementPage} />
                  <Route exact path="/newsletters" component={newsletterPage} />
                  <Route exact path="/resources" component={FolderPage} />
                  <Route exact path="/calendar" component={calendarPage} />
                  <Route exact path="/contacts" component={contactPage} />
                  <Route exact path="/logout" component={logout} />
                  <Route exact path="/admins" component={AdminPage} />
                  <Route exact path="/resources/:folderId" component={FolderPage} />
                  <Route exact path="/resources/search/:searchTerm" component={SearchPage} />
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
            <Route exact path="/backdoorlogin" component={BackdoorLoginPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="*">
              {window.location.href.split("/").slice(-1)[0] === "backdoorLogin" ? (
                <Redirect to="/backdoorLogin" />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
          </Router>
        </Provider>
      );
    }
  }
}

export default App;
