import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { clearErrors } from "../../redux/actions/dataActions";

// Editor
import CKEditor from "ckeditor4-react";

// styles
// import "./PostAnn.css";
import "../../css/textContent.css";
import "../../css/layout.css";

// Antd
import { Button, Form, Input, Modal } from "antd";

class AnnouncementPostEditorModal extends Component {
  componentDidUpdate() {
    this.formRef.current.resetFields();
  }

  formRef = React.createRef();

  render() {
    return (
      <Modal
        title="Post New Announcement"
        visible={this.props.visible}
        centered={true}
        width={1000}
        closable={false}
        footer={[
          <Button
            className="modalFooterLeftButton"
            danger
            type="primary"
            key="delete"
            onClick={() => {
              this.props.handleDeleteThisAnnouncement();
              this.formRef.current.resetFields();
            }}
          >
            Delete
          </Button>,
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
            {this.props.isEditingExistingAnnouncement ? "Save changes" : "Post"}
          </Button>,
        ]}
      >
        <div
          className="double-padded-content-container"
          style={{ marginBottom: "15px" }}
        >
          {/* <h2 className="section-header">Post New Announcement</h2> */}
          <Form
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
                  toolbar: [
                    {
                      name: "Basic",
                      items: [
                        "Bold",
                        "Italic",
                        "Underline",
                        "Superscript",
                        "Subscript",
                        "Link",
                        "Image",
                      ],
                    },
                  ],
                }}
              />
            </Form.Item>
            {/* <Form.Item>
              {this.props.isEditingExistingAnnouncement && (
                <Button
                  // className="right-aligned-btn"
                  // style={{ marginRight: "0" }}
                  variant="contained"
                  type="danger"
                  onClick={() => {
                    this.props.handleDeleteThisAnnouncement();
                    this.formRef.current.resetFields();
                  }}
                >
                  Delete
                </Button>
              )}
              <Button
                // className="right-aligned-btn"
                // style={{ marginRight: "0" }}
                variant="contained"
                onClick={() => {
                  this.props.handleCancelEditAnnouncement();
                  this.formRef.current.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                className="right-aligned-btn"
                style={{ marginRight: "0" }}
                type="primary"
                variant="contained"
                htmlType="submit"
              >
                {this.props.isEditingExistingAnnouncement
                  ? "Save changes"
                  : "Post"}
              </Button>
            </Form.Item> */}
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
