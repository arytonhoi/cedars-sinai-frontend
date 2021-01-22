import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// styles
import "../../css/modal.css";

// Antd
import { Button, Form, Input, Modal } from "antd";

class NewsletterEditorModal extends Component {
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
        title="Post new newsletter"
        visible={this.props.visible}
        centered={true}
        closable={false}
        footer={
          this.state.isDeleting
            ? [
                <h3 className="modal-delete-confirmation" key="message">
                  Delete newsletter?
                </h3>,
                <span className="modal-footer-filler" key="space"></span>,
                <Button key="back" onClick={this.toggleDeleting}>
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="danger"
                  onClick={() => {
                    this.props.handleDeleteThisNewsletter();
                    this.formRef.current.resetFields();
                    this.toggleDeleting();
                  }}
                >
                  Delete
                </Button>,
              ]
            : [
                this.props.isEditingExistingNewsletter ? (
                  <Button danger type="primary" key="delete" onClick={this.toggleDeleting}>
                    Delete
                  </Button>
                ) : null,
                <span className="modal-footer-filler" key="space"></span>,
                <Button
                  key="back"
                  onClick={() => {
                    this.props.handleCancelEditNewsletter();
                    this.formRef.current.resetFields();
                  }}
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  variant="contained"
                  form="newsletterPostEditorForm"
                  htmlType="submit"
                >
                  {this.props.isEditingExistingNewsletter ? "Save changes" : "Post"}
                </Button>,
              ]
        }
      >
        <div>
          <Form
            className="modal-form"
            id="newsletterPostEditorForm"
            layout="vertical"
            ref={this.formRef}
            initialValues={{
              newsletterTitle: this.props.newsletterTitle,
              newsletterUrl: this.props.newsletterUrl,
            }}
            onFinish={(formValues) => {
              this.props.handlePostOrPatchNewsletter(formValues);
              this.formRef.current.resetFields();
            }}
          >
            <Form.Item
              name="newsletterTitle"
              rules={[{ required: true, message: "Please input a title." }]}
              label="Title"
            >
              <Input name="newsletterTitle" type="text" placeholder="ex: Happy Holidays!" />
            </Form.Item>
            <Form.Item
              name="newsletterUrl"
              rules={[{ required: true, message: "Please input a url to the newsletter pdf." }]}
              label="PDF Link"
            >
              <Input name="newsletterUrl" type="text" placeholder="ex: http://newsletter.pdf" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  }
}

NewsletterEditorModal.propTypes = {
  // newsletter info
  isEditingExistingNewsletter: PropTypes.bool.isRequired,
  // newsletterTitle: PropTypes.string.isRequired,
  // newsletterAuthor: PropTypes.string.isRequired,
  // newsletterContent: PropTypes.string.isRequired,
  // functions
  handlePostOrPatchNewsletter: PropTypes.func.isRequired,
  handleCancelEditNewsletter: PropTypes.func.isRequired,
  handleDeleteThisNewsletter: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(NewsletterEditorModal);
