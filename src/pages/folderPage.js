import React, { Component } from "react";

// redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import store from "../redux/store";
import {
  DELETE_SUBFOLDER,
  PATCH_SUBFOLDER,
  POST_FOLDER,
  SORT_SUBFOLDER,
} from "../redux/types";
import {
  deleteFolder,
  patchSubfolder,
  postFolder,
  getFolder,
  searchFolder,
} from "../redux/actions/folderActions";
import { clearAllErrors, clearError } from "../redux/actions/uiActions";

// components
import DeleteFolderModal from "../components/folders/deleteFolderModal.js";
import FolderHeaderNav from "../components/folders/folderHeaderNav";
import Folder from "../components/folders/folder";
import FolderPostCard from "../components/folders/folderPostCard";
import MoveFolderModal from "../components/folders/moveFolderModal.js";
import RenameFolderModal from "../components/folders/renameFolderModal.js";

// styles
import "../css/page.css";
import "../components/folders/folder.css";

// antd
import { DownOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Empty,
  Input,
  Layout,
  Menu,
  notification,
  Spin,
} from "antd";
const { Content, Footer } = Layout;
const { Search } = Input;

class FolderPage extends Component {
  constructor() {
    super();
    this.folderListRef = React.createRef();
    this.state = {
      // flags
      isEditingPost: false,
      showSearchResults: false,
      searchKey: "",
      editor: null,
      // modals
      showMoveFolderModal: false,
      showDeleteFolderModal: false,
      showRenameFolderModal: false,
      isAddingFolder: false,
      // folder display
      numFolderColumns: null,
      // selecting folders
      selectedFolders: [],
      // sorting folders
      requestedSubfolderSortKey: null,
    };
  }

  renderFolder = (currentFolderId) => {
    if (!currentFolderId) currentFolderId = "home";
    this.props.getFolder(currentFolderId, true);
  };

  // component functions
  componentDidMount() {
    this.props.clearAllErrors();
    this.renderFolder(this.props.match.params.folderId);
  }

  componentDidUpdate(prevProps) {
    // render page based on current folder id
    if (prevProps.match.params.folderId !== this.props.match.params.folderId) {
      this.renderFolder(this.props.match.params.folderId);
    }

    // set initial numFolderColumns
    if (!this.state.numFolderColumns && this.folderListRef.current) {
      this.computeNumFolderColumns();
    }

    // setting default sort
    let defaultSubfolderSort = this.props.folders.folder.defaultSubfolderSort;
    if (!this.state.requestedSubfolderSortKey && defaultSubfolderSort) {
      this.setState({
        requestedSubfolderSortKey: defaultSubfolderSort,
      });
    }

    // render action progress and errors
    let currentErrors = this.props.ui.errors;
    let currentloadingActions = this.props.ui.loadingActions;
    let previousLoadingActions = prevProps.ui.loadingActions;
    let previousLoadingActionNames = Object.keys(previousLoadingActions);
    previousLoadingActionNames.forEach((actionName) => {
      if (
        !currentloadingActions[actionName] &&
        previousLoadingActions[actionName]
      ) {
        // if preivousLoadingAction is no longer loading
        switch (actionName) {
          case POST_FOLDER:
            notification.close(POST_FOLDER);
            currentErrors[actionName]
              ? notification["error"]({
                  message: "Failed to add folder",
                  description: currentErrors[actionName],
                  duration: 0,
                  onClose: () => {
                    clearError(POST_FOLDER);
                  },
                })
              : notification["success"]({
                  message: "Folder added!",
                });
            break;

          case PATCH_SUBFOLDER:
            notification.close(PATCH_SUBFOLDER);
            currentErrors[actionName]
              ? notification["error"]({
                  message: "Failed to update folder",
                  description: currentErrors[actionName],
                  duration: 0,
                  onClose: () => {
                    clearError(PATCH_SUBFOLDER);
                  },
                })
              : notification["success"]({
                  message: "Folder updated!",
                });
            break;

          case DELETE_SUBFOLDER:
            notification.close(DELETE_SUBFOLDER);
            currentErrors[actionName]
              ? notification["error"]({
                  message: "Failed to delete folder",
                  description: currentErrors[actionName],
                  duration: 0,
                  onClose: () => {
                    clearError(DELETE_SUBFOLDER);
                  },
                })
              : notification["success"]({
                  message: "Folders deleted!",
                });
            break;
          default:
            break;
        }
      }
    });
  }

  // toggle page state functions
  toggleEditingPost = () => {
    this.setState({
      isEditingPost: !this.state.isEditingPost,
    });
  };

  toggleShowModal = (modalStateName) => {
    this.setState({
      ...this.state,
      [modalStateName]: !this.state[modalStateName],
    });
  };

  // search functions
  searchFolder = (searchTerm) => {
    this.props.history.push(`/resources/search/${searchTerm.trim()}`);
  };

  // folder editing action functions
  handleAddSubfolder = () => {
    this.setState({
      ...this.state,
      isAddingFolder: true,
      showRenameFolderModal: true,
    });
  };

  handleCancelAddSubfolder = () => {
    this.setState({
      ...this.state,
      isAddingFolder: false,
      showRenameFolderModal: false,
    });
  };

  handlePostSubfolder = (formValues) => {
    notification.open({
      key: POST_FOLDER,
      duration: 0,
      message: "Adding folder...",
      icon: <LoadingOutlined />,
    });
    const newFolder = {
      title: formValues.folderTitle,
    };
    this.props.postFolder(this.props.folders.folder.id, newFolder);
    this.handleCancelAddSubfolder();
  };

  handleRenameFolder = (formValues) => {
    notification.open({
      key: PATCH_SUBFOLDER,
      duration: 0,
      message: "Renaming folder...",
      icon: <LoadingOutlined />,
    });
    var folder = this.state.selectedFolders[0];
    this.props.patchSubfolder(folder.id, {
      parent: folder.parent,
      title: formValues.folderTitle,
      content: folder.content,
    });
    this.setState({
      ...this.state,
      showRenameFolderModal: false,
      selectedFolders: [],
    });
  };

  handleMoveSubfolders = () => {
    notification.open({
      key: PATCH_SUBFOLDER,
      duration: 0,
      message: "Moving folder...",
      icon: <LoadingOutlined />,
    });
    let folders = this.state.selectedFolders;
    if (folders.length >= 0) {
      folders.map((x) => {
        if (
          this.props.folders.moveFolderModalCurrentPath.movingFolderId !== x.id
        ) {
          // this.toggleSelect(null, x);
          this.props.patchSubfolder(x.id, {
            parent: this.props.folders.moveFolderModalCurrentPath
              .movingFolderId,
          });
          store.dispatch({ type: DELETE_SUBFOLDER, payload: x.id });
        }
        return 0;
      });
    }
    this.setState({
      showMoveFolderModal: false,
      selectedFolders: [],
    });
  };

  handleDeleteSubfolders = () => {
    notification.open({
      key: DELETE_SUBFOLDER,
      duration: 0,
      message: "Deleting folder...",
      icon: <LoadingOutlined />,
    });
    this.state.selectedFolders.map((folder) =>
      this.props.deleteFolder(folder.id)
    );
    this.setState({
      showDeleteFolderModal: false,
      selectedFolders: [],
    });
  };

  sortSubfolders = (event) => {
    const sortKey = event.key;
    // if (this.props.isEditingFolders) {
    //   let updatedFolder = this.props.folders;
    //   updatedFolder.defaultSubfolderSort = sortKey;
    //   this.props.patchFolder(updatedFolder.id, updatedFolder);
    // }
    this.setState({ requestedSubfolderSortKey: sortKey });
    store.dispatch({ type: SORT_SUBFOLDER, payload: sortKey });
  };

  // select folder functions
  subfolderIsSelected = (subfolder) => {
    let selectedFolders = this.state.selectedFolders;
    if (selectedFolders.length === 0) return false;

    for (let i = 0; i < selectedFolders.length; i++) {
      if (selectedFolders[i].id === subfolder.id) return true;
    }

    return false;
  };

  findFoldersInBetweenSelections = (selectedFolder) => {
    let subfolders = this.props.folders.folder.subfolders;
    let currentlySelectedFolders = this.state.selectedFolders;
    let lastSelectedFolder =
      currentlySelectedFolders[currentlySelectedFolders.length - 1];
    let foldersInBetween = [];

    if (!lastSelectedFolder) {
      foldersInBetween = [selectedFolder];
    } else {
      let lastSelectedFolderIdx = subfolders.findIndex(
        // Cannot read property 'id' of undefined
        (f) => f.id === lastSelectedFolder.id
      );
      let selectedFolderIdx = subfolders.findIndex(
        (f) => f.id === selectedFolder.id
      );

      lastSelectedFolderIdx < selectedFolderIdx
        ? (foldersInBetween = subfolders.slice(
            lastSelectedFolderIdx,
            selectedFolderIdx + 1
          ))
        : (foldersInBetween = subfolders.slice(
            selectedFolderIdx,
            lastSelectedFolderIdx
          ));
    }

    return foldersInBetween;
  };

  handleFolderClick = (event, folder) => {
    event.preventDefault();
    // https://stackoverflow.com/questions/54786555/text-gets-highlighted-if-clicked-with-shift-ie-11
    if (!this.props.user.isAdmin) {
      this.props.history.push(`/resources/${folder.id}`);
    } else {
      let selectedFolders = this.state.selectedFolders;
      let idx = selectedFolders.indexOf(folder);

      if (event.metaKey || event.ctrlKey) {
        // select or deselect multiple folders individually
        idx >= 0
          ? (selectedFolders = selectedFolders
              .slice(0, idx)
              .concat(selectedFolders.slice(idx + 1)))
          : selectedFolders.push(folder);
        this.setState({ selectedFolders: selectedFolders });
      } else if (event.shiftKey) {
        // select multiple folders at once
        let additionalSelectedFolders = this.findFoldersInBetweenSelections(
          folder
        );
        // filter out already selected folders
        additionalSelectedFolders = additionalSelectedFolders.filter(
          (f) => selectedFolders.indexOf(f) < 0
        );
        selectedFolders = selectedFolders.concat(additionalSelectedFolders);
        this.setState({ selectedFolders: selectedFolders });
      } else {
        // select or deselect one folder
        idx >= 0
          ? this.setState({ selectedFolders: [] })
          : this.setState({ selectedFolders: [folder] });
      }
    }
  };

  handleFolderDoubleClick = (event, folder) => {
    this.setState({ selectedFolders: [] });
    this.props.history.push(`/resources/${folder.id}`);
  };

  computeNumFolderColumns = () => {
    // equation where x = num folder columns
    // width = 200x + 12x - 12
    // x = floor( (width + 12) / 212 )

    // examples
    // width = 899, x = 4.297 => 4 columns
    // width = 1126, x = 5.3679 => 5 columns
    let minFolderWidth = 250;
    let columnGapWidth = 12;
    const folderListElement = this.folderListRef.current;
    if (folderListElement) {
      let numFolderColumns = Math.floor(
        (folderListElement.clientWidth + columnGapWidth) /
          (minFolderWidth + columnGapWidth)
      );
      // console.log(
      //   `Width: ${folderListElement.clientWidth}, numCols: ${numFolderColumns}`
      // );
      this.setState({
        numFolderColumns: numFolderColumns,
      });
    }
  };

  render() {
    const { isAdmin } = this.props.user;
    const { loadingActions, errors } = this.props.ui;
    const { folder } = this.props.folders;

    let currentFolderId = this.props.match.params.folderId;
    if (!currentFolderId || currentFolderId === "") {
      currentFolderId = "home";
    }

    const subfolderSortOptions = {
      alphabetical: "Alphabetical order",
      most_popular: "Most viewed",
      last_modified: "Last modified",
      most_recently_added: "Newest",
      least_recently_added: "Oldest",
    };

    const subfolderSortMenu = (
      <Menu onClick={this.sortSubfolders}>
        {Object.keys(subfolderSortOptions).map((option) => (
          <Menu.Item key={option}>{subfolderSortOptions[option]}</Menu.Item>
        ))}
      </Menu>
    );

    window.addEventListener("resize", this.computeNumFolderColumns);

    return (
      <div className="page-container">
        <MoveFolderModal
          visible={this.state.showMoveFolderModal}
          handleMoveSubfolders={this.handleMoveSubfolders}
          selectedFolders={this.state.selectedFolders}
          toggleShowModal={this.toggleShowModal}
        />
        <RenameFolderModal
          visible={this.state.showRenameFolderModal}
          isAddingFolder={this.state.isAddingFolder}
          handlePostSubfolder={this.handlePostSubfolder}
          handleRenameFolder={this.handleRenameFolder}
          selectedFolders={this.state.selectedFolders}
          toggleShowModal={this.toggleShowModal}
        />
        <DeleteFolderModal
          visible={this.state.showDeleteFolderModal}
          handleDeleteSubfolders={this.handleDeleteSubfolders}
          selectedFolders={this.state.selectedFolders}
          toggleShowModal={this.toggleShowModal}
        />
        <header className="page-header-container">
          <div className="page-header-main-items">
            <Search
              size="large"
              className="folder-search"
              placeholder="Search in Resources"
              // prefix={<SearchOutlined />}
              onSearch={(searchTerm) => this.searchFolder(searchTerm)}
            />
          </div>
        </header>
        <Layout className="vertical-fill-layout">
          <Content className="content-card">
            <header className="content-card-header">
              <div className="header-row">
                <FolderHeaderNav />
                <span className="header-interactive-items">
                  {isAdmin && this.state.selectedFolders.length > 0 && (
                    <div className="folder-select-button-container">
                      <Button
                        disabled={this.state.selectedFolders.length === 0}
                        danger
                        onClick={() =>
                          this.toggleShowModal("showDeleteFolderModal")
                        }
                      >
                        Delete
                      </Button>
                      <Button
                        disabled={this.state.selectedFolders.length === 0}
                        onClick={() =>
                          this.toggleShowModal("showMoveFolderModal")
                        }
                      >
                        Move
                      </Button>
                      <Button
                        disabled={this.state.selectedFolders.length !== 1}
                        onClick={() =>
                          this.toggleShowModal("showRenameFolderModal")
                        }
                      >
                        Rename
                      </Button>
                    </div>
                  )}
                  {isAdmin && (
                    <Button type="primary" onClick={this.handleAddSubfolder}>
                      Add Folder
                    </Button>
                  )}
                </span>
              </div>
            </header>
            <div className="padded-content-card-content">
              <header className="header-row folder-section-header-row">
                <h2>Folders</h2>
                <span className="header-interactive-items">
                  <Dropdown overlay={subfolderSortMenu}>
                    <h2>
                      {`Sorted:  ${
                        this.state.requestedSubfolderSortKey
                          ? subfolderSortOptions[
                              this.state.requestedSubfolderSortKey
                            ]
                          : "loading..."
                      }`}
                      <DownOutlined style={{ marginLeft: "6px" }} />
                    </h2>
                  </Dropdown>
                </span>
              </header>
              {(loadingActions.SET_FOLDER || !this.state.numFolderColumns) && (
                <div className="vertical-content">
                  <Spin />
                </div>
              )}
              {!loadingActions.SET_FOLDER && folder.subfolders.length === 0 && (
                <div
                  className="vertical-content"
                  style={{ margin: "48px auto" }}
                >
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span>
                        {isAdmin
                          ? 'Create folders using "Add Folder"'
                          : "No folders yet"}
                      </span>
                    }
                  />
                </div>
              )}
              {!loadingActions.SET_FOLDER && errors.SET_FOLDER && (
                <div
                  className="vertical-content"
                  style={{ margin: "48px auto" }}
                >
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span>{errors.SET_FOLDER.message}</span>}
                  />
                </div>
              )}
              {!loadingActions.SET_FOLDER && (
                <div
                  className={
                    "wrapped-content folder-list " +
                    `col-${this.state.numFolderColumns}`
                  }
                  ref={this.folderListRef}
                >
                  {folder.subfolders.map((subfolder, i) => (
                    <Folder
                      isSelected={
                        isAdmin && this.subfolderIsSelected(subfolder)
                      }
                      key={subfolder.id}
                      folder={subfolder}
                      handleFolderClick={this.handleFolderClick}
                      handleFolderDoubleClick={this.handleFolderDoubleClick}
                    />
                  ))}
                </div>
              )}
            </div>
            {(folder.content !== "" || isAdmin) && (
              <FolderPostCard
                // flags
                isEditingPost={this.state.isEditingPost}
                //data
                folder={folder}
                currentFolderId={currentFolderId}
                //functions
                toggleEditingPost={this.toggleEditingPost}
              />
            )}
          </Content>
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
  deleteFolder,
  patchSubfolder,
  postFolder,
  getFolder,
  searchFolder,
})(FolderPage);
