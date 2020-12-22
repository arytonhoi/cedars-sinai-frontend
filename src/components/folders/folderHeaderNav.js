import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// css
import "../../css/page.css";

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
            <Menu.Item>
              <a
                // target="_blank"
                // rel="noopener noreferrer"
                href={folder.id}
              >
                {folder.name}
              </a>
            </Menu.Item>
          );
        })}
      </Menu>
    );

    return (
      <span style={{ height: "22px" }}>
        <a className="em4-light" href="/resources">
          Resources
        </a>
        {dropdownPathList.length > 0 && (
          <span className="em4-light" key={folder.id}>
            {" / "}
            <Dropdown overlay={navMenu}>
              <p
                style={{ display: "inline-block" }}
                // className="ant-dropdown-link"
                className="em4-light"
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
              <span className="em4-light" key={folder.id}>
                {" / "}
                <a className="em4-light" href={folder.id}>
                  {folder.name}
                </a>
              </span>
            )
          );
        })}
        {/* {folder &&
            folder.path &&
            folder.path.map((x, i) => {
              if (x.name.length >= 30) {
                x.name = x.name.slice(0, 30) + "...";
              }
              return (
                x.id !== "" &&
                x.id !== "home" && (
                  <span className="em4-light" key={x.id}>
                    {" / "}
                    <a className="em4-light" href={x.id}>
                      {x.name}
                    </a>
                  </span>
                )
              );
            })} */}
      </span>
    );
  }
}

FolderHeaderNav.propTypes = { folders: PropTypes.object.isRequired };

const mapStateToProps = (state) => {
  return { folders: state.folders };
};

export default connect(mapStateToProps, {})(FolderHeaderNav);
