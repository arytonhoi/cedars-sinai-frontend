import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// css
import "../../css/modal.css";

// Ant Design
import { Button, Form, Input, Modal } from "antd";

class RenameFolderModal extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
    };
  }

  componentDidUpdate() {
    if (this.formRef.current) {
      this.formRef.current.resetFields();
    }
  }

  formRef = React.createRef();

  render() {
    let folder;
    if (this.props.selectedFolders[0]) {
      folder = this.props.selectedFolders[0];
    } else {
      folder = {
        title: "",
      };
    }

    return (
      <Modal
        className="modal"
        title={"Rename folder"}
        visible={this.props.visible}
        footer={[
          <span className="modal-footer-filler" key="space"></span>,
          <Button
            key="back"
            onClick={() => this.props.toggleShowModal("showRenameFolderModal")}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            form="renameFolderForm"
            htmlType="submit"
          >
            Rename
          </Button>,
        ]}
      >
        <Form
          className="modal-form"
          id="renameFolderForm"
          layout="vertical"
          ref={this.formRef}
          initialValues={{
            folderTitle: folder.title,
          }}
          onFinish={(formValues) => {
            this.props.renameFolder(formValues);
            this.formRef.current.resetFields();
          }}
        >
          <Form.Item
            name="folderTitle"
            rules={[
              { required: true, message: "Folder name cannot be blank." },
            ]}
            label="Name"
          >
            <Input
              id="folderTitle"
              name="folderTitle"
              type="text"
              placeholder="ex: Equipment"
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

RenameFolderModal.propTypes = {
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

export default connect(mapStateToProps, {})(RenameFolderModal);
