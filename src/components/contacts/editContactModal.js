import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// css
import "../../css/modal.css";

// Ant Design
import { Avatar, Button, Input, Form, Modal, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
const { Option } = Select;
// eslint-disable-next-line
const RFC5322 = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const phoneRegex = /^\(? *\d{3} *\)? *\d{3} *-? *\d{4}$/;

class EditContactModal extends Component {
  render() {
    return (
      <>
        <Modal
          title="Confirm Deletion?"
          visible={this.props.confirmDelete}
          centered={true}
          closable={false}
          footer={[
            <Button key="back" onClick={this.props.toggleDeleteModal}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="danger"
              onClick={() =>
                this.props.handleDeleteContact(this.props.contactId)
              }
            >
              Delete
            </Button>,
          ]}
        >
          <span>This action cannot be undone.</span>
        </Modal>
        <Modal
          className="modal"
          title="Edit Contact Info"
          visible={this.props.visible}
          centered={true}
          closable={false}
          footer={[
            <Button
              className="left-align"
              danger
              type="primary"
              key="delete"
              onClick={this.props.toggleDeleteModal}
            >
              Delete
            </Button>,
            <Button key="back" onClick={this.props.handleCancelContactChange}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.props.handleSubmitContactChange}
            >
              Save Changes
            </Button>,
          ]}
        >
          <Form
            className="modal-form"
            layout="vertical"
            initialValues={{
              contactDepartmentId: this.props.contactDepartmentId,
              contactName: this.props.contactName,
              contactPhone: this.props.contactPhone,
              contactEmail: this.props.contactEmail,
            }}
          >
            <div className="upload-centered">
              <input
                id="imageInput"
                type="file"
                hidden="hidden"
                onChange={this.props.handleImageChange}
              />

              <Avatar
                className={this.props.isUploading ? "blur" : "noblur"}
                size="large"
                src={this.props.contactImgUrl}
              />
              <Button
                icon={<EditOutlined />}
                onClick={this.props.handleClickImageUpload}
              >
                Edit photo
              </Button>
            </div>

            <Form.Item name="contactDepartmentId" label="Department">
              <Select
                name="contactDepartmentId"
                onChange={(departmentId) => {
                  var event = {};
                  var target = {};
                  target.name = "contactDepartmentId";
                  target.value = departmentId;
                  event.target = target;
                  this.props.handleChange(event);
                }}
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
              rules={[{ required: true, message: "Please input your name." }]}
              label="Name"
            >
              <Input
                id="contactName"
                name="contactName"
                type="text"
                onChange={this.props.handleChange}
                placeholder="ex: Jane Doe"
              />
            </Form.Item>
            <Form.Item
              name="contactPhone"
              rules={[
                { required: true, message: "Please input your phone number." },
                { pattern: phoneRegex, message: "Did not fit phone regex." },
              ]}
              label="Phone Number"
            >
              <Input
                id="contactPhone"
                name="contactPhone"
                type="phone"
                onChange={this.props.handleChange}
                placeholder="ex: (123) 456 7890"
              />
            </Form.Item>
            <Form.Item
              name="contactEmail"
              rules={[
                { required: true, message: "Please input your email." },
                { pattern: RFC5322, message: "Did not fit email regex." },
              ]}
              label="E-mail"
            >
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                onChange={this.props.handleChange}
                placeholder="ex: janedoe@email.com"
              />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

EditContactModal.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(EditContactModal);
