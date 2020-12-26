import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// components
import AddFolder from "./AddFolder.js";
import Folder from "./folder.js";

// css
import "../../css/page.css";

// Ant Design
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Empty, Layout, Menu, Spin } from "antd";
const { Content } = Layout;

class FoldersCard extends Component {
  subfolderIsSelected = (subfolder) => {
    let selectedFolders = this.props.selectedFolders;
    if (selectedFolders.length === 0) return false;

    for (let i = 0; i < selectedFolders.length; i++) {
      if (selectedFolders[i].id === subfolder.id) return true;
    }

    return false;
  };

  render() {
    const { isAdmin } = this.props.user;
    const { loadingActions } = this.props.ui;
    const { folder } = this.props.folders;

    // subfolder sort stuff
    const subfolderSortOptions = {
      alphabetical: "Alphabetical order",
      most_popular: "Most popular",
      last_modified: "Last modified",
      most_recently_added: "Most recently added",
      least_recently_added: "Least recently added",
    };

    const subfolderSortMenu = (
      <Menu onClick={this.props.sortSubfolders}>
        {Object.keys(subfolderSortOptions).map((option) => (
          <Menu.Item key={option}>{subfolderSortOptions[option]}</Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div>
        <Content className="content-card">
          <div className="content-card-header">
            <div className="header-row">
              <h1>Folders</h1>
              <span className="header-interactive-items">
                <Dropdown overlay={subfolderSortMenu}>
                  <Button>
                    {this.props.requestedSubfolderSortKey === null
                      ? "Sort folders by"
                      : subfolderSortOptions[
                          this.props.requestedSubfolderSortKey
                        ]}
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </span>
            </div>
          </div>
          {loadingActions.SET_FOLDER && (
            <div className="padded-content vertical-content">
              <Spin />
            </div>
          )}
          {!loadingActions.SET_FOLDER && folder.subfolders.length === 0 && (
            <div
              className="padded-content vertical-content"
              style={{ margin: "48px auto" }}
            >
              {isAdmin ? (
                <div className="vertical-content">
                  <h3 className="em2">There are no folders here.</h3>
                  <h4 className="em3">Create using "Edit Folders"</h4>
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span>No folders yet</span>}
                />
              )}
            </div>
          )}
          {!loadingActions.SET_FOLDER && (
            <div className="padded-content wrapped-content">
              <AddFolder parentFolderId={folder.id} format={0} />
              {folder.subfolders.map((subfolder, i) => (
                <Folder
                  isSelected={isAdmin && this.subfolderIsSelected(subfolder)}
                  key={subfolder.id}
                  folder={subfolder}
                  handleFolderClick={this.props.handleFolderClick}
                  handleFolderDoubleClick={this.props.handleFolderDoubleClick}
                />
              ))}
            </div>
          )}
        </Content>
      </div>
    );
  }
}

FoldersCard.propTypes = {
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    folders: state.folders,
    ui: state.ui,
  };
};

export default connect(mapStateToProps, {})(FoldersCard);
