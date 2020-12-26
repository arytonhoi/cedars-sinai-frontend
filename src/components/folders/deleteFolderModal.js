import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// css
import "../../css/modal.css";

// Ant Design
import { Button, List, Modal } from "antd";

class DeleteFolderModal extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
    };
  }

  render() {
    let folderNames = this.props.selectedFolders.map((folder) => folder.title);

    return (
      <Modal
        className="modal"
        title="Permanently delete these folders?"
        visible={this.props.visible}
        footer={[
          <Button
            key="cancel"
            onClick={() => this.props.toggleShowModal("showDeleteFolderModal")}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="danger"
            onClick={this.props.handleDeleteSubfolders}
          >
            Delete
          </Button>,
        ]}
      >
        <List
          size="small"
          // header={
          //   <div>
          //     Permanently delete all following folders, subfolders, and posts?
          //   </div>
          // }
          // footer={<div>Footer</div>}
          bordered
          dataSource={folderNames}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
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
