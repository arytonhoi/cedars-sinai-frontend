import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// css
import "../../css/modal.css";

// Ant Design
import { Button, Input, Form, Modal } from "antd";

class EditDepartmentModal extends Component {
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
              this.props.handleDeleteDepartment(this.props.departmentId)
            }
          >
            Delete
          </Button>,
        ]}
      >
        <span>This action cannot be undone.</span>
      </Modal>
      <Modal
        title="Edit Department Info:"
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
          <Button key="back" onClick={this.props.handleCancelDepartmentChange}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={this.props.handleSubmitDepartmentChange}
          >
            Save Changes
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item
            name="departmentName"
            className="requiredInput"
            rules={[{ required: true, message: 'Department cannot be blank.' }]}
            label="Department Name">
            <Input
              id="departmentName"
              name="departmentName"
              type="text"
              value={this.props.departmentName}
              onChange={this.props.handleChange}
              placeholder="ex: Managers"
            />
          </Form.Item>
        </Form>
      </Modal>
      </>
    );
  }
}

EditDepartmentModal.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(EditDepartmentModal);
