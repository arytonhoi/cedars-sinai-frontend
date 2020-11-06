import React, { Component } from "react";
import "./Folder.css";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
//import { deleteAnnounce, clearErrors } from "../../redux/actions/dataActions";

class Folder extends Component {
  render() {
    const { label, href } = this.props
    return(
      <div className="folder">
        <a className="folder-link" href={"resources/" + href}>
          <span className="folder-logo">F</span>
          <span className="folder-label">{label}</span>
        </a>
      </div>
    );
  }
}

Folder.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { })(
  Folder
);
