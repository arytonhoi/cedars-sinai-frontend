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

// css
import "../../css/page.css";
import "../../css/genPage.css";

// Ant Design
import {
  ArrowLeftOutlined,
  FolderFilled,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Layout, Modal } from "antd";
const { Content } = Layout;

class RenameFolderModal extends Component {
  constructor() {
    super();
    this.state = {
      selectedFolders: [],
      positionModified: false,
      folderMoveCandidate: { start: [0, 0], target: null, id: "" },
      folderPosList: [[], []],
      errors: {},
    };
  }

  render() {
    const { credentials } = this.props.user;
    const { navpath } = this.props.data;
    // const isAdmin = credentials.isAdmin;
    const folders = this.props.data.data;

    return (
      <Modal
        className="move-dialog center noselect"
        title={
          navpath.parent === "" ? (
            "Move to " + navpath.title
          ) : (
            <div className="move-modal-top">
              <ArrowLeftOutlined
                onClick={() => this.props.getNavRoute(navpath.parent)}
              />
              <span>{"Move to " + navpath.title}</span>
            </div>
          )
        }
        visible={this.props.visible}
        // onCancel={() => {
        //   this.toggleStateFlag("showMoveDialog");
        //   this.props.getNavRoute();
        // }}
        footer={[
          <Button
            key="1"
            onClick={() => {
              this.props.toggleShowModal("showMoveFolderModal");
              this.props.getNavRoute();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="2"
            type="primary"
            onClick={this.props.moveFolders}
            disabled={navpath.id === folders[0].id}
          >
            {/* {"Move Folder" + s + " Here"} */}
            "Move Folder Here"
          </Button>,
        ]}
      >
        {navpath.children.length === 0 ? (
          <div className="navpath-list-empty">
            <i>This folder has no subfolders</i>
          </div>
        ) : (
          navpath.children.map((x, i) =>
            this.props.selectedFolders.findIndex((p) => p.id === x.id) ===
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
              <div className="navpath-list navpath-list-disabled" key={x.id}>
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
    );
  }
}

RenameFolderModal.propTypes = {
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
})(RenameFolderModal);
