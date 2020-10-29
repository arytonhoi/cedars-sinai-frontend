import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// import MyButton from "../../util/jsx/MyButton";
import AddPost from "../posts/AddPost";
// MUI stuff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
// Icons
// import HomeIcon from "@material-ui/icons/Home";
// import LogoutIcon from "@material-ui/icons/PowerOff";

class Sidebar extends Component {
  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    return (
      <AppBar>
        <Toolbar className="nav-container">
          <Fragment>
            {isAdmin && <AddPost />}
            <Button color="inherit" component={Link} to="/announcements">
              Announcements
            </Button>
            <Button color="inherit" component={Link} to="/resources">
              Resources
            </Button>
            <Button color="inherit" component={Link} to="/calendar">
              Calendar
            </Button>
            <Button color="inherit" component={Link} to="/contacts">
              Contacts
            </Button>
            <Button color="inherit" component={Link} to="/logout">
              Logout
            </Button>
          </Fragment>
        </Toolbar>
      </AppBar>
    );
  }
}

Sidebar.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps)(Sidebar);
