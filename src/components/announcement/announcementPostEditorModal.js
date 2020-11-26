import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { clearErrors } from "../../redux/actions/dataActions";

// Editor
import CKEditor from "ckeditor4-react";

// styles
import "../../css/modal.css";

// Antd
import { Button, Form, Input, Modal } from "antd";

class AnnouncementPostEditorModal extends Component {
  constructor() {
    super();
    this.state = {
      isDeleting: false,
    };
  }

  componentDidUpdate() {
    if (this.formRef.current) {
      this.formRef.current.resetFields();
    }
  }

  toggleDeleting = (event) => {
    this.setState({
      isDeleting: !this.state.isDeleting,
    });
  };

  formRef = React.createRef();

  render() {
    return (
      <Modal
        className="modal"
        title="Post New Announcement"
        visible={this.props.visible}
        centered={true}
        width={1000}
        closable={false}
        footer={
          this.state.isDeleting
            ? [
                <h3 className="modal-delete-confirmation">
                  Delete announcement?
                </h3>,
                <span className="modal-footer-filler"></span>,
                <Button key="back" onClick={this.toggleDeleting}>
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="danger"
                  onClick={() => {
                    this.props.handleDeleteThisAnnouncement();
                    this.formRef.current.resetFields();
                    this.toggleDeleting();
                  }}
                >
                  Delete
                </Button>,
              ]
            : [
                this.props.isEditingExistingAnnouncement ? (
                  <Button
                    danger
                    type="primary"
                    key="delete"
                    onClick={this.toggleDeleting}
                  >
                    Delete
                  </Button>
                ) : null,
                <span className="modal-footer-filler"></span>,
                <Button
                  key="back"
                  onClick={() => {
                    this.props.handleCancelEditAnnouncement();
                    this.formRef.current.resetFields();
                  }}
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  variant="contained"
                  form="announcementPostEditorForm"
                  htmlType="submit"
                >
                  {this.props.isEditingExistingAnnouncement
                    ? "Save changes"
                    : "Post"}
                </Button>,
              ]
        }
      >
        <div style={{ marginTop: "-15px", marginBottom: "-15px" }}>
          <Form
            className="modal-form"
            id="announcementPostEditorForm"
            layout="vertical"
            ref={this.formRef}
            initialValues={{
              announcementTitle: this.props.announcementTitle,
              announcementAuthor: this.props.announcementAuthor,
              announcementContent: this.props.announcementContent,
            }}
            onFinish={(formValues) => {
              this.props.handlePostOrPatchAnnouncement(formValues);
              this.formRef.current.resetFields();
            }}
          >
            <Form.Item
              name="announcementTitle"
              rules={[{ required: true, message: "Please input a title." }]}
            >
              <Input name="announcementTitle" type="text" placeholder="Title" />
            </Form.Item>
            <Form.Item
              name="announcementAuthor"
              rules={[{ required: true, message: "Please input your name." }]}
            >
              <Input
                name="announcementAuthor"
                type="text"
                placeholder="Author"
              />
            </Form.Item>
            <Form.Item
              name="announcementContent"
              getValueFromEvent={(event) => {
                const data = event.editor.getData();
                return data;
              }}
              rules={[{ required: true, message: "Please add some content." }]}
            >
              <CKEditor
                // onChange={() => {
                //   console.log(
                //     this.formRef.current.getFieldValue("announcementContent")
                //   );
                // }}
                data={this.props.announcementContent}
                style={{ marginBottom: "15px" }}
                config={{
                  disallowedContent: "script embed *[on*]",
                  removeButtons: "",
                }}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  }
}

AnnouncementPostEditorModal.propTypes = {
  // announcement info
  isEditingExistingAnnouncement: PropTypes.bool.isRequired,
  announcementTitle: PropTypes.string.isRequired,
  announcementAuthor: PropTypes.string.isRequired,
  announcementContent: PropTypes.string.isRequired,
  // functions
  handlePostOrPatchAnnouncement: PropTypes.func.isRequired,
  handleCancelEditAnnouncement: PropTypes.func.isRequired,
  handleDeleteThisAnnouncement: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { clearErrors })(
  AnnouncementPostEditorModal
);
