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

class DeleteFolderModal extends Component {
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
    // const { credentials } = this.props.user;
    // const { navpath } = this.props.data;
    // const isAdmin = credentials.isAdmin;
    // const folders = this.props.data.data;
    const s = "s";

    return (
      <Modal
        className="center"
        title="Are you sure?"
        visible={this.props.visible}
        footer={[
          <Button
            key="cancel"
            onClick={() => this.props.toggleShowModal("showDeleteFolderModal")}
          >
            Cancel
          </Button>,
          <Button key="submit" type="danger" onClick={this.props.deleteFolders}>
            Delete
          </Button>,
        ]}
      >
        Deleting{" "}
        {this.props.selectedFolders.map((x, i, a) =>
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
    );
  }
}

DeleteFolderModal.propTypes = {
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
})(DeleteFolderModal);
