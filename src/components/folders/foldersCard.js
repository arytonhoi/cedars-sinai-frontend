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
  MOVE_SUBFOLDER,
  SORT_SUBFOLDER,
  DELETE_SUBFOLDER,
} from "../../redux/types";

// components
import AddFolder from "./AddFolder.js";
import Folder from "./Folder.js";
import MoveFolderModal from "./moveFolderModal.js";
import DeleteFolderModal from "./deleteFolderModal.js";
// import RenameFolderModal from "./renameFolderModal.js";

// css
import "../../css/page.css";

// Ant Design
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout, Menu } from "antd";
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
      selectedFolders: [],
      positionModified: false,
      folderMoveCandidate: { start: [0, 0], target: null, id: "" },
      folderPosList: [[], []],
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

  // action functions
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

  // editing mode toggle functions
  exitFolderEditMode = () => {
    console.log(this.props.folders.subfolders);
    if (this.state.positionModified) {
      this.props.syncAllSubFolders(this.props.folders.subfolders);
      this.setState({ positionModified: false });
    }
    this.props.toggleFolderEditable();
  };

  // other folder functions

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
    const { navpath } = this.props.data;
    const isAdmin = credentials.isAdmin;
    const folders = this.props.folders;
    const menu = (
      <Menu onClick={(e) => this.props.sortSubfolders(e)}>
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
        <DeleteFolderModal
          visible={this.state.showDeleteFolderModal}
          deleteFolders={this.deleteFolders}
          selectedFolders={this.state.selectedFolders}
          toggleShowModal={this.toggleShowModal}
        />
        <Content className="content-card">
          {folders.subfolders.length > 0 || this.props.editFolders ? (
            <div className="content-card-header">
              <div className="header-row">
                <h1>Folders</h1>
                <span className="page-header-interactive-items">
                  {isAdmin &&
                  this.props.editFolders &&
                  this.state.selectedFolders.length > 0 ? (
                    <>
                      <Button
                        disabled={this.state.selectedFolders.length === 0}
                        type="danger"
                        onClick={() =>
                          this.toggleShowModal("showDeleteFolderModal")
                        }
                      >
                        Delete {this.state.selectedFolders.length} Folder{s}
                      </Button>
                      <Button
                        disabled={this.state.selectedFolders.length === 0}
                        onClick={() =>
                          this.toggleShowModal("showMoveFolderModal")
                        }
                      >
                        Move {this.state.selectedFolders.length} Folder{s}
                      </Button>
                      <Button
                        disabled={this.state.selectedFolders.length === 0}
                        onClick={() =>
                          this.toggleShowModal("showRenameFolderModal")
                        }
                      >
                        Rename {this.state.selectedFolders.length} Folder{s}
                      </Button>
                    </>
                  ) : (
                    ""
                  )}
                  <Dropdown overlay={menu}>
                    <Button>
                      {this.props.requestedSort === null
                        ? "Order folders by"
                        : menuSelector[this.props.requestedSort]}{" "}
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                  {isAdmin && !this.props.editPost ? (
                    this.props.editFolders ? (
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
                        onClick={this.props.toggleFolderEditable}
                      >
                        Edit Folders
                      </Button>
                    )
                  ) : (
                    ""
                  )}
                </span>
              </div>
            </div>
          ) : isAdmin ? (
            <div className="folder-blank noselect">
              <h3 className="em2">It seems like there are no subfolders</h3>
              <h4 className="em3">
                You can create subfolders under any folder.
              </h4>
              <AddFolder target={this.props.pageName} format={1} />
            </div>
          ) : (
            ""
          )}
          <div className="folder-holder">
            {isAdmin && this.props.editFolders ? (
              <AddFolder target={this.props.pageName} format={0} />
            ) : (
              ""
            )}
            {folders.subfolders.length > 0
              ? folders.subfolders.map((x, i) => (
                  <Folder
                    onMouseDown={(e) => this.folderDragStart(e, x)}
                    onMouseUp={this.folderDragEnd}
                    key={x.id}
                    label={x.title}
                    href={
                      isAdmin && this.props.editFolders
                        ? (e) => this.toggleSelect(e, x)
                        : this.props.editPost
                        ? () => 0
                        : x.id
                    }
                  />
                ))
              : ""}
          </div>
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
