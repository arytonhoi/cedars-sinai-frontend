import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Redux stuff
import { connect } from "react-redux";

// css
import "./folder.css";

// antd
import { Breadcrumb, Menu } from "antd";

class FolderHeaderNav extends Component {
  render() {
    let { folder } = this.props.folders;
    let searchResultFolder = this.props.searchResultFolder;
    if (searchResultFolder) {
      folder = searchResultFolder;
    }

    let pathList = folder.path.map((folder) => {
      if (folder.name.length >= 40) {
        folder.name = folder.name.slice(0, 37) + "...";
      }
      return folder;
    });

    let renderedPathList = [];
    let dropdownPathList = [];
    if (pathList.length > 3) {
      dropdownPathList = pathList.slice(0, -2);
      renderedPathList = pathList.slice(-2);
    } else {
      renderedPathList = pathList;
    }

    const collapsedPathsMenu = (
      <Menu>
        {dropdownPathList.map((folder) => {
          return (
            <Menu.Item key={folder.id}>
              <Link to={`/resources/${folder.id}`}>{folder.name}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
    );

    if (searchResultFolder) {
      return (
        <Link className="folder-header-nav search-result-link" to={`/resources/${folder.id}`}>
          {`Resources` +
            (dropdownPathList.length > 0 ? " / . . ." : "") +
            `${renderedPathList.map((folder) => ` / ${folder.name}`).join("")}`}
        </Link>
      );
    } else {
      return (
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link className="folder-header-nav" to={`/resources`}>
              Resources
            </Link>
          </Breadcrumb.Item>
          {dropdownPathList.length > 0 && (
            <Breadcrumb.Item
              className="collapsed-folder-header-nav-container"
              overlay={collapsedPathsMenu}
              dropdownProps={{ placement: "bottomLeft", arrow: "false" }}
            >
              <span className="folder-header-nav">. . .</span>
            </Breadcrumb.Item>
          )}
          {renderedPathList.map((folder) => {
            return (
              folder.id !== "" &&
              folder.id !== "home" && (
                <Breadcrumb.Item key={folder.id}>
                  <Link className="folder-header-nav" to={`/resources/${folder.id}`}>
                    {folder.name}
                  </Link>
                </Breadcrumb.Item>
              )
            );
          })}
        </Breadcrumb>
      );
    }
  }
}

FolderHeaderNav.propTypes = { folders: PropTypes.object.isRequired };

const mapStateToProps = (state) => {
  return { folders: state.folders };
};

export default connect(mapStateToProps, {})(FolderHeaderNav);
