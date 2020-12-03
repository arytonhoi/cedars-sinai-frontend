import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { patchUserPassword } from "../../redux/actions/userActions";

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

  handlePatchNewPassword = (formValues) => {
    const reqBody = {
      username: this.props.targettedUser,
      currentPassword: formValues.currentPassword,
      newPassword: formValues.newPassword,
    };

    console.log(reqBody);
    // this.props.patchUserPassword(reqBody);
  };

  formRef = React.createRef();

  render() {
    const targettedUser = this.props.targettedUser;
    return (
      <div className="page-form-container max-30">
        <h2 className="page-form-header">{targettedUser}</h2>
        <Form
          className="page-form"
          id={`departmentEditorForm-${targettedUser}`}
          layout="vertical"
          ref={this.formRef}
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          onFinish={(formValues) => {
            this.handlePatchNewPassword(formValues);
            // this.formRef.current.resetFields();
          }}
        >
          <Form.Item
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Please input your current password.",
              },
            ]}
            label="Current password"
          >
            <Input.Password
              id={`currentPassword-${targettedUser}`}
              name="currentPassword"
              type="text"
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password." },
              {
                min: 6,
                message: "Password must be at least 6 characters.",
              },
            ]}
            label="New password"
          >
            <Input
              id={`newPassword-${targettedUser}`}
              name="newPassword"
              type="text"
              // placeholder="ex: Managers"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm password"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password.",
              },

              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    "The two passwords that you entered do not match."
                  );
                },
              }),
            ]}
          >
            <Input
              id={`confirmPassword-${targettedUser}`}
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
  targettedUser: PropTypes.string.isRequired,
  patchUserPassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  patchUserPassword,
})(PasswordEditorForm);
