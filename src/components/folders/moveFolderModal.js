import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { getNavRoute } from "../../redux/actions/folderActions";

// css
import "../../css/page.css";
import "../../css/genPage.css";

// Ant Design
import {
  ArrowLeftOutlined,
  FolderFilled,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Modal } from "antd";

class MoveFolderModal extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
    };
  }

  render() {
    const { moveFolderModalCurrentPath } = this.props.folders;
    const folder = this.props.folders.folder;
    let s = "s";
    if (this.props.selectedFolders.length === 1) {
      s = "";
    }

    return (
      <Modal
        className="move-dialog center noselect"
        title={
          moveFolderModalCurrentPath.destinationFolderId === "" ? (
            "Move to " + moveFolderModalCurrentPath.title
          ) : (
            <div className="move-modal-top">
              <ArrowLeftOutlined
                onClick={() =>
                  this.props.getNavRoute(
                    moveFolderModalCurrentPath.destinationFolderId
                  )
                }
              />
              <span>{"Move to " + moveFolderModalCurrentPath.title}</span>
            </div>
          )
        }
        visible={this.props.visible}
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
            disabled={moveFolderModalCurrentPath.movingFolderId === folder.id}
          >
            {"Move Folder" + s + " Here"}
          </Button>,
        ]}
      >
        {moveFolderModalCurrentPath.destinationFolderChildren.length === 0 ? (
          <div className="navpath-list-empty">
            <i>This folder has no subfolders</i>
          </div>
        ) : (
          moveFolderModalCurrentPath.destinationFolderChildren.map((x, i) =>
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

MoveFolderModal.propTypes = {
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

export default connect(mapStateToProps, {
  getNavRoute,
})(MoveFolderModal);
