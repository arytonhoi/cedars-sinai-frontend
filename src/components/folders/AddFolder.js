import React, { Component } from "react";

// Redux stuff
import { connect } from "react-redux";
import { postFolder } from "../../redux/actions/dataActions";

// css
import "../../css/modal.css";
import "./Folder.css";
import "./AddFolder.css";

// antd
import { Button, Form, Input, Modal } from "antd";

class AddFolder extends Component {
  constructor() {
    super();
    this.state = {
      showCreateFolderModal: false,
      // parentFolderId: "",
      errors: {},
    };
  }

  componentDidMount() {
    // var parentFolderId = this.props.parentFolderId;
    // if (!parentFolderId || parentFolderId === "") {
    //   parentFolderId = "home";
    // }
    // this.setState({
    //   parentFolderId: parentFolderId,
    // });
  }

  componentDidUpdate() {
    if (this.formRef.current) {
      this.formRef.current.resetFields();
    }
  }

  toggleShowCreateFolderModal = () => {
    this.setState({
      ...this.state,
      showCreateFolderModal: !this.state.showCreateFolderModal,
    });
    console.log(this.state);
  };

  handlePostFolder = (formValues) => {
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

//AddFolder.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { postFolder })(AddFolder);
