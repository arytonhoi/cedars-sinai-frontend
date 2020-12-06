import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import store from "../../redux/store";
import {
  getFolder,
  searchFolder,
  deleteFolder,
  updateFolder,
  updateSubFolder,
  getNavRoute,
  syncAllSubFolders,
} from "../../redux/actions/dataActions";
import {
  DELETE_SUBFOLDER,
  MOVE_SUBFOLDER,
  SORT_SUBFOLDER,
} from "../../redux/types";

// components
import AddFolder from "./AddFolder.js";
import Folder from "./Folder.js";
import MoveFolderModal from "./moveFolderModal.js";
import DeleteFolderModal from "./deleteFolderModal.js";
import RenameFolderModal from "./renameFolderModal.js";

// css
import "../../css/page.css";

// Ant Design
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Empty, Layout, Menu } from "antd";
const { Content } = Layout;

class FoldersCard extends Component {
  constructor() {
    super();
    this.state = {
      // modals
      showMoveFolderModal: false,
      showDeleteFolderModal: false,
      showRenameFolderModal: false,
      // selecting folders
      folderMoveCandidate: { start: [0, 0], target: null, id: "" },
      folderPosList: [[], []],
      positionModified: false,
      selectedFolders: [],
      // sorting folders
      requestedSort: null,
      // errors
      errors: {},
    };
  }

  // modal functions
  toggleShowModal = (modalStateName) => {
    console.log(modalStateName);
    this.setState({
      ...this.state,
      [modalStateName]: !this.state[modalStateName],
    });
  };

  // folder editing action functions
  renameFolders = (formValues) => {
    console.log(formValues);
    var folder = this.state.selectedFolders[0];
    this.toggleSelect(null, folder);
    this.props.updateSubFolder(folder.id, {
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

  moveFolders = () => {
    let folders = this.state.selectedFolders;
    if (folders.length >= 0) {
      folders.map((x) => {
        if (this.props.data.navpath.id !== x.id) {
          this.toggleSelect(null, x);
          this.props.updateSubFolder(x.id, {
            parent: this.props.data.navpath.id,
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

  deleteFolders = () => {
    this.state.selectedFolders.map((folder) =>
      this.props.deleteFolder(folder.id)
    );
    this.setState({
      showDeleteFolderModal: false,
      selectedFolders: [],
    });
  };

  // mode toggle functions
  exitFolderEditMode = () => {
    console.log(this.props.folders.subfolders);
    if (this.state.positionModified) {
      this.props.syncAllSubFolders(this.props.folders.subfolders);
      this.setState({ positionModified: false });
    }
    this.props.toggleEditingFolders();
  };

  // sort functions
  sortSubfolders = (e) => {
    if (this.props.isEditingFolders && this.props.user.credentials.isAdmin) {
      this.props.updateFolder(this.state.pagename, {
        preferredSort: parseInt(e.key),
      });
    }
    this.setState({ requestedSort: parseInt(e.key) });
    store.dispatch({ type: SORT_SUBFOLDER, payload: parseInt(e.key) });
  };

  // drag folder functions
  toggleSelect = (e, x) => {
    var folders = this.state.selectedFolders;
    var pos = folders.findIndex((p) => p.id === x.id);
    if (pos >= 0) {
      folders = folders.slice(0, pos).concat(folders.slice(pos + 1));
      x.hit.className = "folder folder-normal noselect";
    } else {
      x.hit = e.currentTarget;
      folders.push({ ...x });
      e.currentTarget.className = "folder folder-selected noselect";
    }
    this.setState({ selectedFolders: folders });
  };

  folderDragStart = (e, x) => {
    var f = document.querySelectorAll(".folder");
    var arr = this.state.folderPosList;
    f.forEach((a) => {
      arr[0].push(a.offsetLeft);
      arr[1].push(a.offsetTop);
    });
    arr = [
      arr[0].filter((v, i, a) => a.indexOf(v) === i),
      arr[1].filter((v, i, a) => a.indexOf(v) === i),
    ];
    arr[0][arr[0].length - 1] = +Infinity;
    arr[1][arr[1].length - 1] = +Infinity;
    this.setState({
      positionModified: true,
      folderMoveCandidate: {
        start: [e.clientX, e.clientY],
        target: e.currentTarget,
        id: x.id,
      },
      folderPosList: arr,
    });
  };

  folderDragEnd = (e) => {
    var f = this.state.folderMoveCandidate;
    var targetSize = [e.target.clientWidth, e.target.clientHeight];
    var arr = this.state.folderPosList;
    var final = [
      f.target.offsetLeft + e.clientX - f.start[0] - targetSize[0] / 2,
      f.target.offsetTop + e.clientY - f.start[1] - targetSize[1] / 2,
    ];
    var pos = [
      Math.max(arr[0].findIndex((x) => x > final[0])),
      Math.max(arr[1].findIndex((x) => x > final[1])),
    ];
    pos = pos[0] + pos[1] * arr[0].length - 1;
    store.dispatch({
      type: MOVE_SUBFOLDER,
      payload: { id: f.id, newIndex: pos },
    });
    this.props.updateFolder(this.props.pagename, {
      preferredSort: -1,
    });
    this.setState({
      folderMoveCandidate: { start: [0, 0], target: null, id: "" },
      folderPosList: [[], []],
    });
  };

  render() {
    const { credentials } = this.props.user;
    // const { navpath } = this.props.data;
    const isAdmin = credentials.isAdmin;
    const folders = this.props.folders;
    // folders.subfolders = [];

    const menu = (
      <Menu onClick={(e) => this.sortSubfolders(e)}>
        <Menu.Item key="0">Alphabetical order</Menu.Item>
        <Menu.Item key="1">Reverse alphabetical order</Menu.Item>
        <Menu.Item key="2">Most recently added</Menu.Item>
        <Menu.Item key="3">Least recently added</Menu.Item>
        <Menu.Item key="4">Most popular</Menu.Item>
      </Menu>
    );

    let s = "s";
    if (this.state.selectedFolders.length === 1) {
      s = "";
    }

    const menuSelector = [
      "Alphabetical order",
      "Reverse alphabetical order",
      "Most recently added",
      "Least recently added",
      "Most popular",
    ];

    return (
      <div>
        <MoveFolderModal
          visible={this.state.showMoveFolderModal}
          moveFolders={this.moveFolders}
          selectedFolders={this.state.selectedFolders}
          toggleShowModal={this.toggleShowModal}
        />
        <RenameFolderModal
          visible={this.state.showRenameFolderModal}
          renameFolders={this.renameFolders}
          selectedFolders={this.state.selectedFolders}
          toggleShowModal={this.toggleShowModal}
        />
        <DeleteFolderModal
          visible={this.state.showDeleteFolderModal}
          deleteFolders={this.deleteFolders}
          selectedFolders={this.state.selectedFolders}
          toggleShowModal={this.toggleShowModal}
        />
        <Content className="content-card">
          <div className="content-card-header">
            <div className="header-row">
              <h1>Folders</h1>
              <span className="page-header-interactive-items">
                {isAdmin &&
                  !this.props.isEditingPost &&
                  this.props.isEditingFolders &&
                  this.state.selectedFolders.length > 0 && (
                    <span>
                      <Button
                        disabled={this.state.selectedFolders.length === 0}
                        type="danger"
                        onClick={() =>
                          this.toggleShowModal("showDeleteFolderModal")
                        }
                      >
                        Delete {this.state.selectedFolders.length} folder{s}
                      </Button>
                      <Button
                        disabled={this.state.selectedFolders.length === 0}
                        onClick={() =>
                          this.toggleShowModal("showMoveFolderModal")
                        }
                      >
                        Move {this.state.selectedFolders.length} folder{s}
                      </Button>
                      <Button
                        disabled={this.state.selectedFolders.length !== 1}
                        onClick={() =>
                          this.toggleShowModal("showRenameFolderModal")
                        }
                      >
                        Rename folder
                      </Button>
                    </span>
                  )}
                <Dropdown overlay={menu}>
                  <Button>
                    {this.state.requestedSort === null
                      ? "Order folders by"
                      : menuSelector[this.state.requestedSort]}{" "}
                    <DownOutlined />
                  </Button>
                </Dropdown>
                {isAdmin &&
                  (this.props.isEditingFolders ? (
                    <Button
                      type="primary"
                      style={{
                        background: "#52C41A",
                        borderColor: "#52C41A",
                      }}
                      onClick={this.exitFolderEditMode}
                    >
                      Finish Editing
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      disabled={this.props.isEditingPost}
                      onClick={this.props.toggleEditingFolders}
                    >
                      Edit Folders
                    </Button>
                  ))}
              </span>
            </div>
          </div>
          {folders.subfolders.length > 0 ? (
            <div className="padded-content wrapped-content">
              {isAdmin && this.props.isEditingFolders && (
                <AddFolder target={this.props.pageName} format={0} />
              )}
              {folders.subfolders.map((x, i) => (
                <Folder
                  onMouseDown={(e) => this.folderDragStart(e, x)}
                  onMouseUp={this.folderDragEnd}
                  key={x.id}
                  label={x.title}
                  href={
                    isAdmin && this.props.isEditingFolders
                      ? (e) => this.toggleSelect(e, x)
                      : this.props.isEditingPost
                      ? () => 0
                      : x.id
                  }
                />
              ))}
            </div>
          ) : (
            <div
              className="padded-content vertical-content"
              style={{ margin: "48px auto" }}
            >
              {isAdmin ? (
                <div className="vertical-content">
                  <h3 className="em2">It seems like there are no subfolders</h3>
                  <h4 className="em3">
                    You can create subfolders under any folder.
                  </h4>
                  <AddFolder target={this.props.pageName} format={1} />
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span>No folders yet</span>}
                />
              )}
            </div>
          )}
        </Content>
      </div>
    );
  }
}

FoldersCard.propTypes = {
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  folders: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    data: state.data,
    UI: state.UI,
  };
};

export default connect(mapStateToProps, {
  getFolder,
  searchFolder,
  deleteFolder,
  updateFolder,
  updateSubFolder,
  getNavRoute,
  syncAllSubFolders,
})(FoldersCard);
