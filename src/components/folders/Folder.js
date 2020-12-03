import React, { Component } from "react";
import "./Folder.css";
import PropTypes from "prop-types";

import { FolderFilled } from "@ant-design/icons";

// Redux stuff
import { connect } from "react-redux";
//import { deleteAnnounce, clearErrors } from "../../redux/actions/dataActions";

class Folder extends Component {
  render() {
    const { label, href } = this.props;
    if (typeof href === "function") {
      return (
        <div
          className="folder clickable folder-normal noselect"
          onClick={href}
          onMouseDown={this.props.onMouseDown}
          onMouseUp={this.props.onMouseUp}
        >
          <div className="folder-link">
            <span className="folder-logo-icon">
              <FolderFilled />
            </span>
            <span className="folder-label">{label}</span>
          </div>
        </div>
      );
    } else {
      return (
        <a
          className="folder folder-normal noselect"
          href={"/resources/" + href}
        >
          <div className="folder-link">
            <span className="folder-logo-icon">
              <FolderFilled />
            </span>
            <span className="folder-label">{label}</span>
          </div>
        </a>
      );
    }
  }
}

Folder.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
  ]).isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Folder);
