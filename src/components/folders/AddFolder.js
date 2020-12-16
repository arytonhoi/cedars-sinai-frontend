import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { POST_FOLDER } from "../../redux/types";
import { postFolder } from "../../redux/actions/folderActions";
import { clearError } from "../../redux/actions/uiActions";

// css
import "../../css/modal.css";
import "./Folder.css";
import "./AddFolder.css";

// antd
import { Button, Form, Input, Modal, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

class AddFolder extends Component {
  constructor() {
    super();
    this.state = {
      showCreateFolderModal: false,
      // parentFolderId: "",
    };
  }

  componentDidUpdate(prevProps) {
    if (this.formRef.current) {
      this.formRef.current.resetFields();
    }

    // render action progress and errors
    let currentErrors = this.props.ui.errors;
    let currentloadingActions = this.props.ui.loadingActions;
    let previousLoadingActions = prevProps.ui.loadingActions;
    let previousLoadingActionNames = Object.keys(previousLoadingActions);

    previousLoadingActionNames.forEach((actionName) => {
      if (
        !currentloadingActions[actionName] &&
        previousLoadingActions[actionName]
      ) {
        // if preivousLoadingAction is no longer loading
        switch (actionName) {
          // departments
          case POST_FOLDER:
            notification.close(POST_FOLDER);
            currentErrors[actionName]
              ? notification["error"]({
                  message: "Failed to add folder",
                  description: currentErrors[actionName],
                  duration: 0,
                  onClose: () => {
                    clearError(POST_FOLDER);
                  },
                })
              : notification["success"]({
                  message: "Folder added!",
                });
            break;
          default:
            break;
        }
      }
    });
  }

  toggleShowCreateFolderModal = () => {
    this.setState({
      ...this.state,
      showCreateFolderModal: !this.state.showCreateFolderModal,
    });
    console.log(this.state);
  };

  handlePostFolder = (formValues) => {
    notification.open({
      key: POST_FOLDER,
      duration: 0,
      message: "Adding folder...",
      icon: <LoadingOutlined />,
    });
    const newFolder = {
      title: formValues.folderTitle,
    };
    this.props.postFolder(this.props.parentFolderId, newFolder);
    this.toggleShowCreateFolderModal();
  };

  formRef = React.createRef();

  render() {
    const style = this.props.format;
    return (
      <div
        className={
          typeof style === "undefined" || style === 0
            ? "folder folder-add noselect"
            : "add-blank noselect"
        }
      >
        {typeof style === "undefined" || style === 0 ? (
          <div
            className="fit clickable"
            onClick={this.toggleShowCreateFolderModal}
          >
            <span className="folder-logo-plus">+</span>
            <span className="">Create a folder</span>
          </div>
        ) : (
          <Button type="primary" onClick={this.toggleShowCreateFolderModal}>
            <span className="">Create a folder</span>
          </Button>
        )}
        <Modal
          className="modal"
          title="Add folder"
          visible={this.state.showCreateFolderModal}
          footer={[
            <Button key="back" onClick={this.toggleShowCreateFolderModal}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              form="addFolderForm"
              htmlType="submit"
            >
              Create
            </Button>,
          ]}
        >
          <Form
            className="modal-form"
            id="addFolderForm"
            layout="vertical"
            ref={this.formRef}
            initialValues={{
              folderTitle: "",
            }}
            onFinish={(formValues) => {
              this.handlePostFolder(formValues);
              this.formRef.current.resetFields();
            }}
          >
            <Form.Item
              name="folderTitle"
              rules={[
                { required: true, message: "Please input a folder name." },
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
      </div>
    );
  }
}

AddFolder.propTypes = { clearError: PropTypes.func.isRequired };

const mapStateToProps = (state) => {
  return {
    ui: state.ui,
  };
};

export default connect(mapStateToProps, { clearError, postFolder })(AddFolder);
