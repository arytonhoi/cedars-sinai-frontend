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
    let s = "s";
    if (this.props.selectedFolders.length === 1) {
      s = "";
    }

    let folderNames = this.props.selectedFolders.map((folder) => folder.title);
    // const folderNames = [
    //   "Racing car sprays burning fuel into crowd.",
    //   "Japanese princess to wed commoner.",
    //   "Australian walks 100km after outback crash.",
    //   "Man charged over missing wedding girl.",
    //   "Los Angeles battles huge wildfires.",
    // ];

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
          <Button key="submit" type="danger" onClick={this.props.deleteFolders}>
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
