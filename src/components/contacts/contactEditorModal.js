import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// css
import "../../css/modal.css";

// Ant Design
import { Avatar, Button, Input, Form, Modal, Select, Upload } from "antd";
import { EditOutlined } from "@ant-design/icons";
const { Option } = Select;

// eslint-disable-next-line
const RFC5322 = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const phoneRegex = /^\(? *\d{3} *\)? *\d{3} *-? *\d{4}$/;

class ContactEditorModal extends Component {
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

  toggleDeleting = () => {
    this.setState({
      isDeleting: !this.state.isDeleting,
    });
  };

  formRef = React.createRef();

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.filelist;
  };

  render() {
    return (
      <Modal
        className="modal"
        title={
          this.props.isEditingExistingContact
            ? "Edit contact"
            : "Add new contact"
        }
        visible={this.props.visible}
        centered={true}
        closable={false}
        footer={
          this.state.isDeleting
            ? [
                <h3 className="modal-delete-confirmation" key="message">
                  Delete contact?
                </h3>,
                <span className="modal-footer-filler" key="space"></span>,
                <Button key="back" onClick={this.toggleDeleting}>
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="danger"
                  onClick={() => {
                    this.props.handleDeleteContact();
                    this.formRef.current.resetFields();
                    this.toggleDeleting();
                  }}
                >
                  Delete
                </Button>,
              ]
            : [
                this.props.isEditingExistingContact ? (
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
                    this.props.handleCancelAddorEditContact();
                    this.formRef.current.resetFields();
                  }}
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  form="contactEditorForm"
                  htmlType="submit"
                >
                  {this.props.isEditingExistingContact ? "Save changes" : "Add"}
                </Button>,
              ]
        }
      >
        <Form
          className="modal-form"
          id="contactEditorForm"
          layout="vertical"
          ref={this.formRef}
          initialValues={{
            contactDepartmentId: this.props.contactDepartmentId,
            contactImgUrl: this.props.contactImgUrl,
            contactName: this.props.contactName,
            contactPhone: this.props.contactPhone,
            contactEmail: this.props.contactEmail,
          }}
          onFinish={(formValues) => {
            this.props.handlePostOrPatchContact(formValues);
            this.formRef.current.resetFields();
          }}
        >
          <Form.Item
            name="contactImgUrl"
            valuePropName="filelist"
            getValueFromEvent={this.normFile}
          >
            <div className="upload-centered">
              <Avatar size="large" src={this.props.contactImgUrl} />
              <Upload
                name="logo"
                action={this.props.handleImageChange}
                showUploadList={false}
              >
                <Button icon={<EditOutlined />}>Edit photo</Button>
              </Upload>
            </div>
          </Form.Item>
          <Form.Item
            name="contactDepartmentId"
            label="Department"
            rules={[{ required: true }]}
          >
            <Select
              name="contactDepartmentId"
              placeholder="Select a department"
            >
              {this.props.departments.map((d) => (
                <Option key={d.id} value={d.id}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="contactName"
            rules={[{ required: true, message: "Please input a name." }]}
            label="Name"
          >
            <Input name="contactName" type="text" placeholder="ex: Jane Doe" />
          </Form.Item>
          <Form.Item
            name="contactPhone"
            rules={[
              {
                required: true,
                message: "Please input a phone number.",
              },
              { pattern: phoneRegex, message: "Invalid phone number." },
            ]}
            label="Phone Number"
          >
            <Input
              name="contactPhone"
              type="phone"
              placeholder="ex: (123) 456-7890"
            />
          </Form.Item>
          <Form.Item
            name="contactEmail"
            rules={[
              { required: true, message: "Please input an email address." },
              { pattern: RFC5322, message: "Invalid email." },
            ]}
            label="E-mail"
          >
            <Input
              name="contactEmail"
              type="email"
              placeholder="ex: janedoe@email.com"
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

ContactEditorModal.propTypes = {
  user: PropTypes.object.isRequired,
  // contact values
  departments: PropTypes.array.isRequired,
  contactDepartmentId: PropTypes.string.isRequired,
  contactName: PropTypes.string.isRequired,
  contactImgUrl: PropTypes.string.isRequired,
  contactPhone: PropTypes.string.isRequired,
  contactEmail: PropTypes.string.isRequired,
  // form functions
  handlePostOrPatchContact: PropTypes.func.isRequired,
  handleDeleteContact: PropTypes.func.isRequired,
  handleCancelAddorEditContact: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(ContactEditorModal);
