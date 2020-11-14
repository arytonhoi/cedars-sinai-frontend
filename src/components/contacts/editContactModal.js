import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// css
import "../../css/modal.css";

// Ant Design
import { Button, Input, Form, Modal, Select } from "antd";
const { Option } = Select;

class EditContactModal extends Component {
  render() {
    return (
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
            onClick={() => this.props.handleDeleteContact(this.props.contactId)}
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
        <Form layout="vertical">
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
