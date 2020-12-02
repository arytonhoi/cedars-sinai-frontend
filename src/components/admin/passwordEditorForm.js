import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// css
import "../../css/modal.css";

// Ant Design
import { Button, Input, Form } from "antd";

class PasswordEditorForm extends Component {
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
      <div className="page-form-container max-30">
        <h2 className="page-form-header">{this.props.title}</h2>
        <Form
          className="page-form"
          id="departmentEditorForm"
          layout="vertical"
          ref={this.formRef}
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          onFinish={(formValues) => {
            // this.props.handlePostOrPatchDepartment(formValues);
            this.formRef.current.resetFields();
          }}
        >
          <Form.Item
            name="currentPassword"
            rules={[
              { required: true, message: "Current password cannot be blank" },
            ]}
            label="Current password"
          >
            <Input
              id="currentPassword"
              name="currentPassword"
              type="text"
              // placeholder="ex: Managers"
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Current password cannot be blank" },
            ]}
            label="Name"
          >
            <Input
              id="newPassword"
              name="newPassword"
              type="text"
              // placeholder="ex: Managers"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Current password cannot be blank" },
            ]}
            label="Name"
          >
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="text"
              // placeholder="ex: Managers"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Change password
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

PasswordEditorForm.propTypes = {
  user: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(PasswordEditorForm);
