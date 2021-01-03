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
    const { folder } = this.props.folders;

    let pathList = folder.path.map((folder, i) => {
      if (folder.name.length >= 30) {
        folder.name = folder.name.slice(0, 27) + "...";
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

    const navMenu = (
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

    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link className="folder-header-nav" to={`/resources`}>
            Resources
          </Link>
        </Breadcrumb.Item>
        {dropdownPathList.length > 0 && (
          <Breadcrumb.Item
            className="folder-header-nav collapsed-folder-header-nav"
            overlay={navMenu}
          >
            . . .
          </Breadcrumb.Item>
        )}
        {renderedPathList.map((folder, i) => {
          return (
            folder.id !== "" &&
            folder.id !== "home" && (
              <Breadcrumb.Item>
                <Link
                  className="folder-header-nav"
                  key={folder.id}
                  to={`/resources/${folder.id}`}
                >
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

FolderHeaderNav.propTypes = { folders: PropTypes.object.isRequired };

const mapStateToProps = (state) => {
  return { folders: state.folders };
};

export default connect(mapStateToProps, {})(FolderHeaderNav);
