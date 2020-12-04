import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { patchUserPassword } from "../../redux/actions/userActions";

// css
import "../../css/modal.css";

// Ant Design
import { Alert, Button, Input, Form, notification } from "antd";

class PasswordEditorForm extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
    };
  }

  componentDidUpdate() {
    if (this.formRef.current) {
      this.formRef.current.resetFields();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handlePatchNewPassword = (formValues) => {
    const reqBody = {
      username: this.props.targettedUser,
      currentPassword: formValues.currentPassword,
      newPassword: formValues.newPassword,
    };

    this.props.patchUserPassword(reqBody);
  };

  showNotification = (type, message) => {
    notification[type]({
      message: `${message}`,
    });
  };

  formRef = React.createRef();

  render() {
    const targettedUser = this.props.targettedUser;
    const patchUserPasswordErrors = this.state.errors.patchUserPassword;
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
            this.formRef.current.resetFields();
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
              placeholder="At least 6 characters"
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
            />
          </Form.Item>
          {patchUserPasswordErrors &&
            patchUserPasswordErrors.user === this.props.targettedUser && (
              <Alert
                style={{ marginTop: "15px" }}
                message={patchUserPasswordErrors.message}
                type="error"
                showIcon
                closable
              />
            )}
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
    UI: state.UI,
  };
};

export default connect(mapStateToProps, {
  patchUserPassword,
})(PasswordEditorForm);
