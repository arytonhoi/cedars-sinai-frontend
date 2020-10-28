import React, { Component } from "react";
import PropTypes from "prop-types";
import "../css/home.css";

import { connect } from "react-redux";
import { getAnnouncements } from "../redux/actions/dataActions";
import Announcement from "../components/announcement/Announcement.js";

class home extends Component {
  componentDidMount() {
    this.props.getAnnouncements();
  }

  render() {
    const { announce } = this.props.data;
    let announcementsMarkup = announce.map((a) => (
      // <li key={a.announcementId}>
      //   <h1>{a.title}</h1>
      //   <h3>{a.author}</h3>
      //   <p>{a.content}</p>
      // </li>
      <Announcement
        key={a.announcementId}
        index={a.announcementId}
        what={a}
        admin={true}
      />
    ));

    return <div>{announcementsMarkup}</div>;
  }
}

home.propTypes = {
  getAnnouncements: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    data: state.data,
    isAdmin: state.user.is_admin,
  };
};

export default connect(mapStateToProps, { getAnnouncements })(home);
