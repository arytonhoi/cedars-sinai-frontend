import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// css
import "../../css/modal.css";

// Ant Design
import { Button, Input, Form, Modal } from "antd";

class DepartmentEditorModal extends Component {
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

  render() {
    return (
      <Modal
        className="modal"
        title={
          this.props.isEditingExistingDepartment
            ? "Edit department"
            : "Add department"
        }
        visible={this.props.visible}
        centered={true}
        closable={false}
        footer={
          this.state.isDeleting
            ? [
                <h3 className="modal-delete-confirmation" key="message">
                  Delete department and its contacts?
                </h3>,
                <span className="modal-footer-filler" key="space"></span>,
                <Button key="back" onClick={this.toggleDeleting}>
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="danger"
                  onClick={() => {
                    this.props.handleDeleteDepartment();
                    this.formRef.current.resetFields();
                    this.toggleDeleting();
                  }}
                >
                  Delete
                </Button>,
              ]
            : [
                this.props.isEditingExistingDepartment ? (
                  <Button
                    danger
                    type="primary"
                    key="delete"
                    onClick={this.toggleDeleting}
                  >
                    Delete
                  </Button>
                ) : null,
                <span key="space" className="modal-footer-filler"></span>,
                <Button
                  key="back"
                  onClick={this.props.handleCancelAddorEditDepartment}
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  form="departmentEditorForm"
                  htmlType="submit"
                >
                  {this.props.isEditingExistingDepartment
                    ? "Save changes"
                    : "Add"}
                </Button>,
              ]
        }
      >
        <Form
          className="modal-form"
          id="departmentEditorForm"
          layout="vertical"
          ref={this.formRef}
          initialValues={{
            departmentName: this.props.departmentName,
          }}
          onFinish={(formValues) => {
            this.props.handlePostOrPatchDepartment(formValues);
            this.formRef.current.resetFields();
          }}
        >
          <Form.Item
            name="departmentName"
            rules={[
              { required: true, message: "Department name cannot be blank." },
            ]}
            // label="Department Name"
          >
            <Input
              id="departmentName"
              name="departmentName"
              type="text"
              placeholder="ex: Managers"
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

DepartmentEditorModal.propTypes = {
  user: PropTypes.object.isRequired,
  // flags
  visible: PropTypes.bool.isRequired,
  isEditingExistingDepartment: PropTypes.bool.isRequired,
  // department info
  departmentName: PropTypes.string.isRequired,
  handlePostOrPatchDepartment: PropTypes.func.isRequired,
  handleDeleteDepartment: PropTypes.func.isRequired,
  handleCancelAddorEditDepartment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(DepartmentEditorModal);
