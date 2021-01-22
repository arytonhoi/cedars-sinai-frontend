import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { clearError } from "../redux/actions/uiActions";
import { backdoorLoginUser } from "../redux/actions/userActions";
import { SET_USER } from "../redux/types";

// css styles
import "../css/login.css";

// antd
import { Alert, Button, Form, Input } from "antd";

class BackdoorLoginPage extends Component {
  handleLoginUser = (formValues) => {
    const reqBody = {
      email: formValues.email,
      password: formValues.password,
    };

    this.props.backdoorLoginUser(reqBody);
  };

  formRef = React.createRef();
  render() {
    const { errors, loadingActions } = this.props.ui;
    const setUserErrors = errors[SET_USER];
    const loadingLogin = loadingActions[SET_USER];

    return (
      <div className="login-page-container">
        <div className="login-box-container">
          <div className="login-box">
            <h1 className="login-form-header noselect">Backdoor Login</h1>
            <div className="login-form-container">
              <Form
                ref={this.formRef}
                onFinish={(formValues) => {
                  this.handleLoginUser(formValues);
                  this.formRef.current.resetFields();
                }}
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input the email.",
                    },
                  ]}
                  label="Email"
                >
                  <Input id="email" name="email" type="text" autoComplete="off" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input the password.",
                    },
                  ]}
                  label="Password"
                >
                  <Input.Password id="password" name="password" type="text" autoComplete="off" />
                </Form.Item>
                {setUserErrors && (
                  <Alert
                    message={setUserErrors}
                    type="error"
                    showIcon
                    closable
                    afterClose={() => this.props.clearError(SET_USER)}
                  />
                )}
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {loadingLogin ? "Signing in..." : "Sign In"}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BackdoorLoginPage.propTypes = {
  backdoorLoginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  ui: state.ui,
});

const mapActionsToProps = {
  backdoorLoginUser,
  clearError,
};

export default connect(mapStateToProps, mapActionsToProps)(BackdoorLoginPage);
