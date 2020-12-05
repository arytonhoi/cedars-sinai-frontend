import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// css
import "../../css/modal.css";

// Ant Design
import { Button, Modal } from "antd";

class DeleteFolderModal extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
    };
  }

  render() {
    let s = "s";
    if (this.props.selectedFolders.length === 1) {
      s = "";
    }

    return (
      <Modal
        className="modal"
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
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    data: state.data,
    UI: state.UI,
  };
};

export default connect(mapStateToProps, {})(DeleteFolderModal);
