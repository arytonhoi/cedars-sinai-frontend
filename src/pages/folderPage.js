import React, { Component } from "react";

// redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getFolder, searchFolder } from "../redux/actions/folderActions";
import { clearAllErrors } from "../redux/actions/uiActions";

// components
import FolderHeaderNav from "../components/folders/folderHeaderNav";
import FolderPostCard from "../components/folders/folderPostCard";
import FoldersCard from "../components/folders/foldersCard";

// styles
import "../css/genPage.css";
import "../css/page.css";

// antd
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Layout } from "antd";
const { Footer } = Layout;

class FolderPage extends Component {
  constructor() {
    super();
    this.state = {
      pagename: "",
      // flags
      isEditingFolders: false,
      isEditingPost: false,
      // showPostCancelConfirm: false,
      showSearchResults: false,
      searchKey: "",
      editor: null,
    };
  }

  componentDidMount() {
    this.props.clearAllErrors();
    var pageName = this.props.match.params.pageName;
    if (typeof pageName !== "string" || pageName === "") {
      pageName = "home";
    }
    this.props.getFolder(pageName, true);
    this.setState({ ...this.state, pagename: pageName });
  }

  toggleEditingFolders = () => {
    this.setState({
      isEditingFolders: !this.state.isEditingFolders,
    });
  };

  toggleEditingPost = () => {
    this.setState({
      isEditingPost: !this.state.isEditingPost,
    });
  };

  searchFolderCallback = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.searchFolder();
    } else {
      this.setState({ showSearchResults: false, searchKey: e.target.value });
    }
  };

  searchFolder = () => {
    window.location.href = `${
      process.env.PUBLIC_URL
    }/resources/search/${this.state.searchKey.trim()}`;
  };

  render() {
    const { isAdmin } = this.props.user;
    const { loadingActions } = this.props.ui;
    const { folder } = this.props.folders;
    let currentFolderId = this.props.match.params.currentFolderId;
    if (!currentFolderId || currentFolderId === "") {
      currentFolderId = "home";
    }

    return (
      <div className="page-container">
        <header className="page-header-container">
          <div className="page-header-secondary-items">
            <FolderHeaderNav />
          </div>
          <div className="page-header-main-items">
            <h1>
              {loadingActions.SET_FOLDER
                ? "Loading..."
                : typeof folder === "object"
                ? folder.title
                : "Error"}
            </h1>
            <span className="page-header-interactive-items">
              <Input
                onKeyUp={this.searchFolderCallback}
                onSubmit={this.searchFolder}
                disabled={
                  this.state.isEditingFolders || this.state.isEditingPost
                }
                className="resources-search no-padding"
                suffix={<SearchOutlined />}
                placeholder="Search resources by name"
              />
              <Button
                type="primary"
                disabled={
                  this.state.isEditingFolders || this.state.isEditingPost
                }
                onClick={this.searchFolder}
              >
                Search
              </Button>
            </span>
          </div>
        </header>
        <Layout className="vertical-fill-layout">
          <FoldersCard
            // flags
            isEditingFolders={this.state.isEditingFolders}
            isEditingPost={this.state.isEditingPost}
            // data
            folder={folder}
            // functions
            exitFolderEditMode={this.exitFolderEditMode}
            toggleEditingFolders={this.toggleEditingFolders}
          />
          {(folder.content !== "" || isAdmin) && (
            <FolderPostCard
              // flags
              isEditingFolders={this.state.isEditingFolders}
              isEditingPost={this.state.isEditingPost}
              //data
              folder={folder}
              currentFolderId={currentFolderId}
              //functions
              toggleEditingPost={this.toggleEditingPost}
            />
          )}
          <Footer style={{ textAlign: "center" }}>DevelopForGood ©2020</Footer>
        </Layout>
      </div>
    );
  }
}

FolderPage.propTypes = {
  folders: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  // folder functions
  getFolder: PropTypes.func.isRequired,
  searchFolder: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  editable: state.editable,
  folders: state.folders,
  user: state.user,
  ui: state.ui,
});

export default connect(mapStateToProps, {
  clearAllErrors,
  getFolder,
  searchFolder,
})(FolderPage);
