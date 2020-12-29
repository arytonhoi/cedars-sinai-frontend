import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Redux stuff
import { connect } from "react-redux";

// css
import "./folder.css";

// antd
import { Menu, Dropdown } from "antd";

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
      <span style={{ height: "22px" }}>
        <Link className="folder-header-nav" to={`/resources`}>
          Resources
        </Link>
        {dropdownPathList.length > 0 && (
          <span className="folder-header-nav" key={folder.id}>
            {" / "}
            <Dropdown overlay={navMenu}>
              <p
                style={{ display: "inline-block" }}
                className="folder-header-nav"
                onClick={(e) => e.preventDefault()}
              >
                . . .
              </p>
            </Dropdown>
          </span>
        )}
        {renderedPathList.map((folder, i) => {
          return (
            folder.id !== "" &&
            folder.id !== "home" && (
              <span className="folder-header-nav" key={folder.id}>
                {" / "}
                <Link
                  className="folder-header-nav"
                  key={folder.id}
                  to={`/resources/${folder.id}`}
                >
                  {folder.name}
                </Link>
              </span>
            )
          );
        })}
      </span>
    );
  }
}

FolderHeaderNav.propTypes = { folders: PropTypes.object.isRequired };

const mapStateToProps = (state) => {
  return { folders: state.folders };
};

export default connect(mapStateToProps, {})(FolderHeaderNav);
