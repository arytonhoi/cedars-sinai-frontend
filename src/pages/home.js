import React, { Component } from "react";
import PropTypes from "prop-types";
import DateHelper from "../util/dateHelper.js";
import "../css/home.css";

import { connect } from "react-redux";
import { getAnnouncements } from "../redux/actions/dataActions";
import { Link } from "react-router-dom";

class home extends Component {
  componentDidMount() {
    this.props.getAnnouncements();
  }

  render() {
    const { user } = this.props;
    const isAdmin = user.credentials.isAdmin;
    return (
      <div>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/announcements">Announcements</Link>
              </li>
              <li>
                <Link to="/contacts">Contacts</Link>
              </li>
            </ul>
          </nav>

          <span>
            <h3>
              Welcome back.{" "}
              {isAdmin
                ? "You are an admin."
                : "What would you like to do today?"}
            </h3>
          </span>
          <span>{new DateHelper().toString()}</span>
        </div>
      </div>
    );
  }
}

home.propTypes = {
  getAnnouncements: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    data: state.data,
    user: state.user,
  };
};

export default connect(mapStateToProps, { getAnnouncements })(home);
