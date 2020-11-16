import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// css
import "../../css/modal.css";

// Ant Design
import { Button, Input, Form, Modal } from "antd";

class AddDepartmentModal extends Component {
  render() {
    return (
      <Modal
        title="Add Department"
        visible={this.props.visible}
        centered={true}
        closable={false}
        footer={[
          <Button key="back" onClick={this.props.handleCancelDepartmentChange}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={this.props.handleSubmitNewDepartment}
          >
            Add
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item className="requiredInput" label="Department Name">
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
    );
  }
}

AddDepartmentModal.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(AddDepartmentModal);
