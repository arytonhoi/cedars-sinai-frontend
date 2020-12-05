import React, { Component } from "react";
import PropTypes from "prop-types";

import "../css/genPage.css";
import Folder from "../components/folders/Folder.js";
import AddFolder from "../components/folders/AddFolder.js";
import SearchResult from "../components/folders/SearchResult.js";
import CIcon from "../images/icon.png";

import { Input, Menu, Dropdown, Modal, Button, Spin } from "antd";
import {
  FolderFilled,
  ArrowLeftOutlined,
  RightOutlined,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { connect } from "react-redux";
import store from "../redux/store";
import {
  getFolder,
  searchFolder,
  deleteFolder,
  updateFolder,
  updateSubFolder,
  getNavRoute,
  syncAllSubFolders,
} from "../redux/actions/dataActions";
import {
  MOVE_SUBFOLDER,
  SORT_SUBFOLDER,
  DELETE_SUBFOLDER,
} from "../redux/types";

// Editor
import CKEditor from "ckeditor4-react";

//HTML handling
import parse from "html-react-parser";

class genPage extends Component {
  constructor() {
    super();
    this.state = {
      pagename: "",
      editFolders: false,
      showPostCancelConfirm: false,
      showRenameConfirm: false,
      showDeleteConfirm: false,
      showMoveDialog: false,
      showSearchResults: false,
      searchKey: "",
      positionModified: false,
      editPost: false,
      editor: null,
      selectedFolders: [],
      requestedSort: null,
      folderMoveCandidate: { start: [0, 0], target: null, id: "" },
      folderPosList: [[], []],
    };
  }
  componentDidMount() {
    var pageName = this.props.match.params.pageName;
    if (typeof pageName !== "string" || pageName === "") {
      pageName = "home";
    }
    this.props.getFolder(pageName, true);
    this.setState({ ...this.state, pagename: pageName });
    //console.log(this.props)
  }
  sortSubfolders = (e) => {
    if (this.state.editFolders && this.props.user.credentials.isAdmin) {
      this.props.updateFolder(this.state.pagename, {
        preferredSort: parseInt(e.key),
      });
    }
    this.setState({ ...this.state, requestedSort: parseInt(e.key) });
    store.dispatch({ type: SORT_SUBFOLDER, payload: parseInt(e.key) });
  };
  toggleFolderEditable = () => {
    this.setState({
      ...this.state,
      selectedFolders: [],
      editor: null,
      editFolders:
        !this.state.editFolders && this.props.user.credentials.isAdmin,
    });
  };
  togglePostEditable = () => {
    this.setState({
      ...this.state,
      selectedFolders: [],
      editor: null,
      editFolders: false,
      editPost: !this.state.editPost && this.props.user.credentials.isAdmin,
      showPostCancelConfirm: false,
    });
  };
  toggleStateFlag = (x) => {
    this.setState({
      ...this.state,
      [x]: !this.state[x],
    });
  };
  maybeShowPostCancelConfirm = () => {
    this.state.editor === null
      ? this.togglePostEditable()
      : this.toggleStateFlag("showPostCancelConfirm");
  };
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
    this.setState({ ...this.state, selectedFolders: folders });
  };
  renameFolderCallback = (e) => {
    var folders = this.state.selectedFolders;
    folders[e.target.name].title = e.target.value;
    this.setState({ ...this.state, selectedFolders: folders });
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
    if (
      this.state.searchKey !== "" &&
      !this.props.UI.loadingFolderSearch &&
      !this.state.editFolders &&
      !this.state.editPost
    ) {
      this.props.searchFolder(this.state.searchKey);
      this.setState({ showSearchResults: true });
    }
  };
  renameFolders = () => {
    if (this.state.showRenameConfirm) {
      var folders = this.state.selectedFolders;
      if (folders.length >= 0) {
        folders.map((x) => {
          this.toggleSelect(null, x);
          this.props.updateSubFolder(x.id, {
            parent: x.parent,
            title: x.title,
            content: x.content,
          });
          return 0;
        });
      }
    }
    this.setState({
      ...this.state,
      showRenameConfirm: false,
      selectedFolders: [],
    });
  };
  moveFolders = () => {
    if (this.state.showMoveDialog) {
      var folders = this.state.selectedFolders;
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
    }
    this.setState({
      ...this.state,
      showMoveDialog: false,
      selectedFolders: [],
    });
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
    this.props.updateFolder(this.state.pagename, {
      preferredSort: -1,
    });
    this.setState({
      folderMoveCandidate: { start: [0, 0], target: null, id: "" },
      folderPosList: [[], []],
    });
  };
  deleteFolders = () => {
    this.setState({
      ...this.state,
      showDeleteConfirm: false,
      selectedFolders: [],
    });
    if (this.state.showDeleteConfirm) {
      let folders = this.state.selectedFolders;
      if (folders.length >= 0) {
        folders.map((x) => this.props.deleteFolder(x.id));
      }
    }
  };
  exitFolderEditMode = () => {
    //console.log(this.props.data.data[0].subfolders);
    if (this.state.positionModified) {
      this.props.syncAllSubFolders(this.props.data.data[0].subfolders);
      this.setState({ positionModified: false });
    }
    this.toggleFolderEditable();
  };
  updateEditor = (event) => {
    this.setState({ ...this.state, editor: event.editor.getData() });
  };
  saveEditorChanges = () => {
    if (this.state.editor !== null) {
      this.props.updateFolder(this.state.pagename, {
        parent: this.props.data.data[0].parent,
        title: this.props.data.data[0].title,
        content: this.state.editor,
      });
    }
    this.togglePostEditable();
  };
  clearPost = () => {
    this.props.updateFolder(this.state.pagename, {
      parent: this.props.data.data[0].parent,
      title: this.props.data.data[0].title,
      content: "",
    });
    this.togglePostEditable();
  };

  render() {
    const spinner = <img className="spin spin-large" alt="" src={CIcon} />;
    const { UI, data, user } = this.props;
    const pageName = this.props.match.params.pageName;
    const folders = data.data[0];
    UI.errors.folderErrors = [];
    const menu = (
      <Menu onClick={(e) => this.sortSubfolders(e)}>
        <Menu.Item key="0">Alphabetical order</Menu.Item>
        <Menu.Item key="1">Reverse alphabetical order</Menu.Item>
        <Menu.Item key="2">Most recently added</Menu.Item>
        <Menu.Item key="3">Least recently added</Menu.Item>
        <Menu.Item key="4">Most popular</Menu.Item>
      </Menu>
    );
    //console.log(folders)
    var s = "s";
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
    const modalsMarkup =
      user.credentials.isAdmin &&
      !data.loading &&
      data.data.length > 0 &&
      UI.errors.folderErrors.length === 0 ? (
        <div className="resources-editbar noselect">
          <Modal
            className="center"
            title="Are you sure?"
            visible={this.state.showDeleteConfirm}
            onCancel={() => this.toggleStateFlag("showDeleteConfirm")}
            footer={[
              <Button
                key="1"
                onClick={() => this.toggleStateFlag("showDeleteConfirm")}
              >
                No
              </Button>,
              <Button key="2" type="danger" onClick={this.deleteFolders}>
                Yes, delete folder{s}
              </Button>,
            ]}
          >
            Deleting{" "}
            {this.state.selectedFolders.map((x, i, a) =>
              a.length === 1
                ? "'" + x.title + "'"
                : a.length - i === 1
                ? " and '" + x.title + "'"
                : i < a.length - 2
                ? "'" + x.title + "', "
                : "'" + x.title + "' "
            )}{" "}
            will remove all contents, including files and subfolders within the
            folder{s}. This action is irreversible.
          </Modal>
          <Modal
            className="center"
            title={"Rename folder" + s}
            visible={this.state.showRenameConfirm}
            onCancel={() => this.toggleStateFlag("showRenameConfirm")}
            footer={[
              <Button
                key="1"
                onClick={() => this.toggleStateFlag("showRenameConfirm")}
              >
                Cancel
              </Button>,
              <Button key="2" type="primary" onClick={this.renameFolders}>
                Rename
              </Button>,
            ]}
          >
            {this.state.selectedFolders.map((x, i, a) => (
              <input
                key={i}
                maxLength="64"
                className="full-width"
                type="text"
                value={x.title}
                name={i}
                onChange={this.renameFolderCallback}
              />
            ))}
          </Modal>
          <Modal
            className="move-dialog center noselect"
            title={
              data.navpath.parent === "" ? (
                "Move to " + data.navpath.title
              ) : (
                <div className="move-modal-top">
                  <ArrowLeftOutlined
                    onClick={() => this.props.getNavRoute(data.navpath.parent)}
                  />
                  <span>{"Move to " + data.navpath.title}</span>
                </div>
              )
            }
            visible={this.state.showMoveDialog}
            onCancel={() => {
              this.toggleStateFlag("showMoveDialog");
              this.props.getNavRoute();
            }}
            footer={[
              <Button
                key="1"
                onClick={() => {
                  this.toggleStateFlag("showMoveDialog");
                  this.props.getNavRoute();
                }}
              >
                Cancel
              </Button>,
              <Button
                key="2"
                type="primary"
                onClick={this.moveFolders}
                disabled={data.navpath.id === data.data[0].id}
              >
                {"Move Folder" + s + " Here"}
              </Button>,
            ]}
          >
            {data.navpath.children.length === 0 ? (
              <div className="navpath-list-empty">
                <i>This folder has no subfolders</i>
              </div>
            ) : (
              data.navpath.children.map((x, i) =>
                this.state.selectedFolders.findIndex((p) => p.id === x.id) ===
                -1 ? (
                  <div
                    className="navpath-list navpath-list-enabled"
                    key={x.id}
                    onClick={() => this.props.getNavRoute(x.id)}
                  >
                    <span className="navpath-list-left">
                      <FolderFilled />
                      {x.title}
                    </span>
                    <span className="navpath-list-right">
                      <RightOutlined />
                    </span>
                  </div>
                ) : (
                  <div
                    className="navpath-list navpath-list-disabled"
                    key={x.id}
                  >
                    <span className="navpath-list-left">
                      <FolderFilled />
                      {x.title}
                    </span>
                    <span className="navpath-list-right">
                      <RightOutlined />
                    </span>
                  </div>
                )
              )
            )}
          </Modal>
          <Modal
            className="center"
            title={"Cancel changes to your post?"}
            visible={this.state.showPostCancelConfirm}
            onCancel={() => this.toggleStateFlag("showPostCancelConfirm")}
            footer={[
              <Button
                key="1"
                onClick={() => this.toggleStateFlag("showPostCancelConfirm")}
              >
                No
              </Button>,
              <Button key="2" type="primary" onClick={this.togglePostEditable}>
                Yes, Cancel Changes
              </Button>,
            ]}
          >
            This will remove all new changes made to your post.
          </Modal>
        </div>
      ) : (
        ""
      );
    const foldersMarkup =
      !data.loading &&
      data.data.length > 0 &&
      UI.errors.folderErrors.length === 0 ? (
        <div className="floating-component">
          {folders.subfolders.length > 0 || this.state.editFolders ? (
            <div className="folder-topbar noselect">
              <span className="em2">Folders</span>
              <div className="folder-editbar button-holder">
                {user.credentials.isAdmin &&
                this.state.editFolders &&
                this.state.selectedFolders.length > 0 ? (
                  <>
                    <Button
                      disabled={this.state.selectedFolders.length === 0}
                      type="danger"
                      onClick={() => this.toggleStateFlag("showDeleteConfirm")}
                    >
                      Delete {this.state.selectedFolders.length} Folder{s}
                    </Button>
                    <Button
                      disabled={this.state.selectedFolders.length === 0}
                      onClick={() => this.toggleStateFlag("showMoveDialog")}
                    >
                      Move {this.state.selectedFolders.length} Folder{s}
                    </Button>
                    <Button
                      disabled={this.state.selectedFolders.length === 0}
                      onClick={() => this.toggleStateFlag("showRenameConfirm")}
                    >
                      Rename {this.state.selectedFolders.length} Folder{s}
                    </Button>
                  </>
                ) : (
                  ""
                )}
                <Dropdown overlay={menu}>
                  <Button>
                    {this.state.requestedSort === null
                      ? "Order folders by"
                      : menuSelector[this.state.requestedSort]}{" "}
                    <DownOutlined />
                  </Button>
                </Dropdown>
                {user.credentials.isAdmin && !this.state.editPost ? (
                  this.state.editFolders ? (
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
                    <Button type="primary" onClick={this.toggleFolderEditable}>
                      Edit Folders
                    </Button>
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : user.credentials.isAdmin ? (
            <div className="folder-blank noselect">
              <h3 className="em2">It seems like there are no subfolders</h3>
              <h4 className="em3">
                You can create subfolders under any folder.
              </h4>
              <AddFolder target={pageName} format={1} />
            </div>
          ) : (
            ""
          )}
          <div className="folder-holder">
            {user.credentials.isAdmin && this.state.editFolders ? (
              <AddFolder target={pageName} format={0} />
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
                      user.credentials.isAdmin && this.state.editFolders
                        ? (e) => this.toggleSelect(e, x)
                        : this.state.editPost
                        ? () => 0
                        : x.id
                    }
                  />
                ))
              : ""}
          </div>
        </div>
      ) : (
        ""
      );
    const postMarkup =
      !data.loading &&
      data.data.length > 0 &&
      UI.errors.folderErrors.length === 0 ? (
        <div className="floating-component">
          {user.credentials.isAdmin &&
          !this.state.editPost &&
          !this.state.editFolders &&
          folders.content !== "" ? (
            <div className="noselect post-editbar button-holder">
              <Button type="primary" onClick={this.togglePostEditable}>
                Edit Post
              </Button>
            </div>
          ) : (
            ""
          )}
          {folders.content === "" ? (
            user.credentials.isAdmin && !this.state.editPost ? (
              <div className="folder-blank noselect">
                <h3 className="em2">
                  It seems like there is no post for this folder yet.
                </h3>
                <h4 className="em3">Start by creating the post.</h4>
                <Button type="primary" onClick={this.togglePostEditable}>
                  Begin Post
                </Button>
              </div>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {this.state.editPost ? (
            <>
              <div className="post-editbar noselect">
                <div className="button-holder">
                  <Button type="danger" onClick={this.clearPost}>
                    Delete entire post
                  </Button>
                  <Button onClick={this.maybeShowPostCancelConfirm}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    style={{ background: "#52C41A", borderColor: "#52C41A" }}
                    disabled={
                      this.state.editor === null || this.state.editor === ""
                    }
                    onClick={this.saveEditorChanges}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
              <div className="folder-post">
                <CKEditor
                  data={folders.content}
                  onChange={this.updateEditor}
                  config={{
                    disallowedContent: "script embed *[on*]",
                    removeButtons: "",
                    height: "38vh",
                  }}
                />
              </div>
            </>
          ) : (
            <div className="folder-post">{parse(folders.content)}</div>
          )}
        </div>
      ) : (
        ""
      );
    const userBlankState =
      !data.loading &&
      data.data.length > 0 &&
      UI.errors.folderErrors.length === 0 ? (
        <div className="floating-component folder-blank noselect">
          <h3 className="em2">
            It looks like there is nothing in this folder.
          </h3>
          <h4 className="em3">Go back?</h4>
          <Button type="primary">
            <a href={"/resources/" + folders.parent}>Take me back</a>
          </Button>
        </div>
      ) : (
        ""
      );
    // const nullMarkup =
    //   !data.loading && data.data.length === 0 && UI.errors.folderErrors.length === 0 ? (
    //     <div className="floating-component folder-blank noselect">
    //       <h3 className="em2">It looks like this folder does not exist.</h3>
    //       <h4 className="em3">Go back?</h4>
    //       <Button type="primary">
    //         <a href="/resources/">Take me back</a>
    //       </Button>
    //     </div>
    //   ) : (
    //     ""
    //   );
    const pageMarkup =
      data.loading &&
      data.data.length === 0 &&
      UI.errors.folderErrors.length === 0 ? (
        <div className="folder-loading center noselect padding-normal">
          <Spin indicator={spinner} />
          <p className="em4-light">Loading page...</p>
        </div>
      ) : UI.errors.folderErrors.length > 0 || data.data.length === 0 ? (
        <div className="floating-component folder-blank noselect">
          <h3 className="em2">We could not load this folder</h3>
          <h4 className="em3">Go back?</h4>
          <Button type="primary">
            <a href="/resources/">Take me back</a>
          </Button>
        </div>
      ) : this.state.searchKey === "" || !this.state.showSearchResults ? (
        <>
          {modalsMarkup}
          {folders.subfolders.length > 0 || user.credentials.isAdmin
            ? foldersMarkup
            : ""}
          {folders.content !== "" || user.credentials.isAdmin ? postMarkup : ""}
          {folders.content === "" &&
          folders.subfolders.length === 0 &&
          !user.credentials.isAdmin
            ? userBlankState
            : ""}
        </>
      ) : (
        ""
      );
    var searchMarkup = () =>
      this.props.data.folderSearchRes.length > 0 &&
      !this.props.UI.loadingFolderSearch ? (
        <div className="floating-component">
          <h3 className="em2 padding-normal">
            Search Results for '{this.state.searchKey}'
          </h3>
          {this.props.data.folderSearchRes.map((x, i) => (
            <SearchResult key={i} data={x} />
          ))}
        </div>
      ) : this.props.UI.loadingFolderSearch ? (
        <div className="floating-component">
          <h3 className="em2 padding-normal">Searching for results...</h3>
        </div>
      ) : (
        <div className="floating-component">
          <h3 className="em2 padding-normal">
            No results for '{this.state.searchKey}' were found
          </h3>
        </div>
      );

    return (
      <>
        <div className="resources-topbar noselect">
          <div>
            <p>
              <span>
                <a className="em4-light" href="/resources">
                  Resources
                </a>
              </span>
              {typeof folders === "object" && typeof folders.path === "object"
                ? folders.path.map((x, i) => {
                    if (x.name.length >= 30) {
                      x.name = x.name.slice(0, 30) + "...";
                    }
                    return x.id !== "" && x.id !== "home" ? (
                      <span className="em4-light" key={x.id}>
                        {" / "}
                        <a className="em4-light" href={x.id}>
                          {x.name}
                        </a>
                      </span>
                    ) : (
                      ""
                    );
                  })
                : ""}
            </p>
            <div className="em2">
              {UI.errors.folderErrors.length === 0 && data.loading
                ? "Loading..."
                : typeof folders === "object"
                ? folders.title
                : "Error"}
            </div>
          </div>
          <div className="resources-topbar-right">
            <Input
              onKeyUp={this.searchFolderCallback}
              onSubmit={this.searchFolder}
              disabled={this.state.editFolders || this.state.editPost}
              className="resources-search no-padding"
              suffix={<SearchOutlined />}
              placeholder="Search resources by name"
            />
            <Button
              type="primary"
              disabled={this.state.editFolders || this.state.editPost}
              onClick={this.searchFolder}
            >
              Search
            </Button>
          </div>
        </div>
        <div className="floating-component-parent">
          {this.state.searchKey === "" ||
          !this.state.showSearchResults ||
          this.state.editFolders ||
          this.state.editPost
            ? pageMarkup
            : searchMarkup()}
        </div>
      </>
    );
  }
}

genPage.propTypes = {
  getFolder: PropTypes.func.isRequired,
  searchFolder: PropTypes.func.isRequired,
  deleteFolder: PropTypes.func.isRequired,
  updateFolder: PropTypes.func.isRequired,
  updateSubFolder: PropTypes.func.isRequired,
  syncAllSubFolders: PropTypes.func.isRequired,
  getNavRoute: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editable: state.editable,
  data: state.data,
  user: state.user,
  UI: state.UI,
});

export default connect(mapStateToProps, {
  getFolder,
  searchFolder,
  updateFolder,
  updateSubFolder,
  deleteFolder,
  getNavRoute,
  syncAllSubFolders,
})(genPage);
