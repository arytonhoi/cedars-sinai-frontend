import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// components
import FolderHeaderNav from "./folderHeaderNav";

// styles
import "./folder.css";

// antdesign
import { FolderFilled } from "@ant-design/icons";

//HTML handling
import parse from "html-react-parser";

class SearchResult extends Component {
  render() {
    const { folder } = this.props;
    return (
      <article className="search-result-container">
        <div className="search-result-header-row">
          <span className="folder-logo-icon">
            <FolderFilled />
          </span>
          <FolderHeaderNav searchResultFolder={folder} />
        </div>
        {folder.content !== "" && (
          <div className="search-result-content-container">{parse(folder.content)}</div>
        )}
      </article>
    );
  }
}

SearchResult.propTypes = {
  folder: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(SearchResult);
