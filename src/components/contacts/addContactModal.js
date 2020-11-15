import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// css
import "../../css/modal.css";

// Ant Design
import { Avatar, Button, Input, Form, Modal, Select } from "antd";
import { CameraOutlined, EditOutlined } from "@ant-design/icons";
const { Option } = Select;

class AddContactModal extends Component {
  // handleClickImageUpload = () => {
  //   const fileInputDocument = document.getElementById("imageInput");
  //   fileInputDocument.click();
  // };

  render() {
    return (
      <Modal
        title="Add New Contact"
        visible={this.props.visible}
        centered={true}
        closable={false}
        footer={[
          <Button key="back" onClick={this.props.handleCancelContactChange}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={this.props.handleSubmitNewContact}
          >
            Save Changes
          </Button>,
        ]}
      >
        <Form layout="vertical">
          {this.props.contactImgUrl === "" && (
            <div className="upload-centered">
              <input
                id="imageInput"
                type="file"
                hidden="hidden"
                onChange={this.props.handleImageChange}
              />
              <Button
                className="upload-img-circle-btn"
                type="dashed"
                shape="circle"
                icon={<CameraOutlined className="large-anticon" />}
                onClick={this.props.handleClickImageUpload}
              >
                Add contact photo
              </Button>
            </div>
          )}
          {this.props.contactImgUrl !== "" && (
            <div className="upload-centered">
              <input
                id="imageInput"
                type="file"
                hidden="hidden"
                onChange={this.props.handleImageChange}
              />

              <Avatar size="large" src={this.props.contactImgUrl} />
              <Button
                icon={<EditOutlined />}
                onClick={this.props.handleClickImageUpload}
              >
                Edit photo
              </Button>
            </div>
          )}

          <Form.Item className="requiredInput" label="Department">
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
              value={this.props.contactDepartmentId}
              placeholder="Select a department"
            >
              {this.props.departments.map((d) => (
                <Option key={d.id} value={d.id}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="requiredInput" label="Name">
            <Input
              id="contactName"
              name="contactName"
              type="text"
              value={this.props.contactName}
              onChange={this.props.handleChange}
              placeholder="ex: Jane Doe"
            />
          </Form.Item>
          <Form.Item label="Phone Number">
            <Input
              id="contactPhone"
              name="contactPhone"
              type="text"
              value={this.props.contactPhone}
              onChange={this.props.handleChange}
              placeholder="ex: (123) 456 7890"
            />
          </Form.Item>
          <Form.Item className="requiredInput" label="E-mail">
            <Input
              id="contactEmail"
              name="contactEmail"
              type="text"
              value={this.props.contactEmail}
              onChange={this.props.handleChange}
              placeholder="ex: janedoe@email.com"
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

AddContactModal.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(AddContactModal);
