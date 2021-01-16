import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { PATCH_PASSWORD } from "../../redux/types";
import { patchUserPassword } from "../../redux/actions/userActions";
import { logoutUser } from "../../redux/actions/userActions";
import { clearError } from "../../redux/actions/uiActions";

// css
import "../../css/modal.css";

// Ant Design
import { Alert, Button, Input, Form, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

class PasswordEditorForm extends Component {
  patchTargettedUserPasswordActionName = `${PATCH_PASSWORD}_${this.props.targettedUser}`;

  componentDidUpdate(prevProps) {
    if (this.formRef.current) {
      this.formRef.current.resetFields();
    }

    // render action progress and errors
    let currentErrors = this.props.ui.errors;
    let currentloadingActions = this.props.ui.loadingActions;
    let previousLoadingActions = prevProps.ui.loadingActions;
    let previousLoadingActionNames = Object.keys(previousLoadingActions);

    previousLoadingActionNames.forEach((actionName) => {
      if (!currentloadingActions[actionName] && previousLoadingActions[actionName]) {
        // if preivousLoadingAction is no longer loading
        switch (actionName) {
          case this.patchTargettedUserPasswordActionName:
            notification.close(this.patchTargettedUserPasswordActionName);
            if (!currentErrors[actionName]) {
              if (this.props.targettedUser === "admin") {
                notification["success"]({
                  message: "Success!",
                  description: "Password changed successfully! Logging out... ",
                });
                setTimeout(() => {
                  this.props.logoutUser();
                }, 3000);
              } else {
                notification["success"]({
                  message: "Password changed!",
                });
              }
            }
            break;

          default:
            break;
        }
      }
    });
  }

  handlePatchNewPassword = (formValues) => {
    const reqBody = {
      username: this.props.targettedUser,
      currentPassword: formValues.currentPassword,
      newPassword: formValues.newPassword,
    };

    notification.open({
      key: this.patchTargettedUserPasswordActionName,
      duration: 0,
      message: "Changing password...",
      icon: <LoadingOutlined />,
    });

    this.props.patchUserPassword(reqBody);
  };

  showNotification = (type, message) => {
    notification[type]({
      message: `${message}`,
    });
  };

  formRef = React.createRef();

  render() {
    const { errors } = this.props.ui;
    const targettedUser = this.props.targettedUser;
    // errors
    const patchUserPasswordErrors = errors[this.patchTargettedUserPasswordActionName];
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

                  return Promise.reject("The two passwords that you entered do not match.");
                },
              }),
            ]}
          >
            <Input id={`confirmPassword-${targettedUser}`} name="confirmPassword" type="text" />
          </Form.Item>
          {patchUserPasswordErrors && (
            <Alert
              style={{ marginTop: "15px" }}
              message={patchUserPasswordErrors}
              type="error"
              showIcon
              closable
              afterClose={() => this.props.clearError(patchUserPasswordErrors)}
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
  clearError: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  targettedUser: PropTypes.string.isRequired,
  patchUserPassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    ui: state.ui,
  };
};

export default connect(mapStateToProps, {
  clearError,
  logoutUser,
  patchUserPassword,
})(PasswordEditorForm);
