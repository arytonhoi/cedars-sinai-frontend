import React, { Component } from "react";
import "./Announcement.css";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { deleteAnnounce, clearErrors } from "../../redux/actions/dataActions";

class Announcement extends Component {
  render() {
    const announcement = this.props.announcement;

    return (
      <div>
        <header>
          <h1>{announcement.title}</h1>
          <h3>
            {announcement.author} at{" "}
            {announcement.createdAt.toString("dd/MM/yy")}
          </h3>
        </header>
        <div dangerouslySetInnerHTML={{ __html: announcement.content }}></div>
      </div>
    );
  }
}
Announcement.propTypes = {
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    data: state.data,
  };
};

export default connect(mapStateToProps, { deleteAnnounce, clearErrors })(
  Announcement
);
