import React, { Component } from "react";
import "./folder.css";
import PropTypes from "prop-types";

import { FolderFilled } from "@ant-design/icons";

// Redux stuff
import { connect } from "react-redux";

class Folder extends Component {
  render() {
    const folder = this.props.folder;
    return (
      <div
        className={
          "folder-container clickable noselect " +
          (this.props.isSelected ? "folder-selected" : "folder-normal")
        }
        onClick={(event) => {
          this.props.handleFolderClick(event, folder);
        }}
        onDoubleClick={(event) => {
          this.props.handleFolderDoubleClick(event, folder);
        }}
      >
        <div className="folder">
          {/* <span className="folder-logo-icon"> */}
          <FolderFilled />
          {/* </span> */}
          <span className="folder-label">{folder.title}</span>
        </div>
      </div>
    );
  }
}

Folder.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {})(Folder);
