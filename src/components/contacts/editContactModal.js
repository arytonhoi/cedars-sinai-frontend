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

class EditContactModal extends Component {
  render() {
    return (
      <>
      <Modal
        title="Confirm Deletion?"
        visible={this.props.confirmDelete }
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
        title="Edit Contact Info"
        visible={this.props.visible}
        centered={true}
        closable={false}
        footer={[
          <Button
            className="modalFooterLeftButton"
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
        <Form layout="vertical"
          initialValues={{
            contactDepartmentId:this.props.contactDepartmentId,
            contactName:this.props.contactName,
            contactPhone:this.props.contactPhone,
            contactEmail:this.props.contactEmail,
          }}
        >
          <div className="upload-centered">
            <input
              id="imageInput"
              type="file"
              hidden="hidden"
              onChange={this.props.handleImageChange}
            />

            <Avatar className={(this.props.isUploading)?("blur"):("noblur")} size="large" src={this.props.contactImgUrl} />
            <Button
              icon={<EditOutlined />}
              onClick={this.props.handleClickImageUpload}
            >
              Edit photo
            </Button>
          </div>

          <Form.Item
            name="contactDepartmentId"
            className="requiredInput"
            label="Department">
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
            rules={[{ required: true, message: 'Please input your name.' }]}
            className="requiredInput"
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
            className="requiredInput"
            rules={[{ required: true, message: 'Please input your phone number.' }]}
            label="Phone Number">
            <Input
              id="contactPhone"
              name="contactPhone"
              type="phone"
              onChange={this.props.handleChange}
              placeholder="ex: (123) 456 7890"
            />
          </Form.Item>
          <Form.Item
            className="requiredInput"
            name="contactEmail"
            rules={[{ required: true, message: 'Please input your email.' }]}
            label="E-mail">
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              onChange={this.props.handleChange}
              placeholder="ex: janedoe@email.com"
            />
          </Form.Item>
          <br />
          {/* <label htmlFor="contactImgUrl">ImgUrl:</label>
          <input
            id="contactImgUrl"
            name="contactImgUrl"
            type="text"
            value={this.props.contactImgUrl}
            onChange={this.props.handleChange}
          /> */}
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
