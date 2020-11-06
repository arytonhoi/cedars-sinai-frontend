import React, { Component } from "react";
import PropTypes from "prop-types";
import "../css/annPage.css";

import { connect } from "react-redux";
import { getAnnouncements } from "../redux/actions/dataActions";
import Announcement from "../components/announcement/Announcement.js";
import PostAnn from "../components/announcement/PostAnn.js";
import DateHelper from "../util/dateHelper.js";

class home extends Component {
  componentDidMount() {
    this.props.getAnnouncements();
  }

  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const { announcements } = this.props.data;
    // let announcementsMarkup = announcements.map((a) => (
    //   // <li key={a.announcementId}>
    //   //   <h1>{a.title}</h1>
    //   //   <h3>{a.author}</h3>
    //   //   <p>{a.content}</p>
    //   // </li>
    // ));
//console.log(announcements)
    const now = new Date().getTime();
    announcements.sort((a, b) => {
      a.createdAt = new DateHelper(a.createdAt);
      a.createdTs = a.createdAt.getTimestamp();
      b.createdAt = new DateHelper(b.createdAt);
      b.createdTs = b.createdAt.getTimestamp();
      return a.createdTs < b.createdTs;
    });
    const [pinned, unpinned] = announcements.reduce(
      ([p, f], e) => (e.isPinned ? [[...p, e], f] : [p, [...f, e]]),
      [[], []]
    );
    let pinnedAnn = pinned.map((x) =>
      isAdmin || now > x.createdTs ? (
        <Announcement
          key={x.id}
          index={x.id}
          what={x}
          admin={isAdmin}
        />
      ) : (
        ""
      )
    );
    let unpinnedAnn = unpinned.map((x) =>
      isAdmin || (now > x.createdTs && now - x.createdTs < 7776000000) ? (
        <Announcement
          key={x.id}
          index={x.id}
          what={x}
          admin={isAdmin}
        />
      ) : (
        ""
      )
    );

    return (
      <div>
        {isAdmin ? <PostAnn /> : ""}
        <div className="ann-parent-container shadow">
          {pinnedAnn}
          {unpinnedAnn}
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
    user: state.user,
    data: state.data,
  };
};

export default connect(mapStateToProps, { getAnnouncements })(home);
