import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// css
import "../../css/modal.css";
import "./folder.css";

// Ant Design
import { Button, Modal } from "antd";
import { FolderFilled } from "@ant-design/icons";

class DeleteFolderModal extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
    };
  }

  render() {
    return (
      <Modal
        className="modal"
        title="Permanently delete these folders?"
        visible={this.props.visible}
        footer={[
          <Button key="cancel" onClick={() => this.props.toggleShowModal("showDeleteFolderModal")}>
            Cancel
          </Button>,
          <Button key="submit" type="danger" onClick={this.props.handleDeleteSubfolders}>
            Delete
          </Button>,
        ]}
      >
        <ul className="folder-delete-list">
          {this.props.selectedFolders.map((folder) => (
            <li className="folder-container folder-delete-item" key={folder.id}>
              <div className="folder-link">
                <span className="folder-logo-icon">
                  <FolderFilled />
                </span>
                <span className="folder-label">{folder.title}</span>
              </div>
            </li>
          ))}
        </ul>
      </Modal>
    );
  }
}

DeleteFolderModal.propTypes = {
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    data: state.data,
    ui: state.ui,
  };
};

export default connect(mapStateToProps, {})(DeleteFolderModal);
