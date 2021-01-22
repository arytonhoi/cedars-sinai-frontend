import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { clearError } from "../redux/actions/uiActions";
import { loginUser } from "../redux/actions/userActions";
import { SET_USER } from "../redux/types";

// css styles
import "../css/login.css";

// antd
import { Alert, Button, Form, Input } from "antd";

class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      user: "staff",
    };
  }

  handleLoginUser = (formValues) => {
    const reqBody = {
      username: this.state.user,
      password: formValues.password,
    };

    this.props.loginUser(reqBody);
  };

  handleSwitchUser = () => {
    this.state.user === "staff"
      ? this.setState({ user: "admin" })
      : this.setState({ user: "staff" });
  };

  formRef = React.createRef();
  render() {
    const { errors, loadingActions } = this.props.ui;
    const setUserErrors = errors[SET_USER];
    const loadingLogin = loadingActions[SET_USER];

    return (
      <div className="login-page-container">
        <header className="login-page-header">
          <img className="login-header-logo" src={process.env.PUBLIC_URL + "/logo.png"} alt="" />
        </header>
        <div className="login-box-container">
          <div className="login-box">
            <h1 className="login-form-header noselect">
              {"OR Education Portal" + (this.state.user === "admin" ? " (Admin)" : " ")}
            </h1>
            <div className="login-form-container">
              <Form
                ref={this.formRef}
                onFinish={(formValues) => {
                  this.handleLoginUser(formValues);
                  this.formRef.current.resetFields();
                }}
              >
                <Form.Item
                  className="login-password-input"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input the password.",
                    },
                  ]}
                  label="Enter Password"
                >
                  <Input.Password id="password" name="password" type="text" autoComplete="off" />
                </Form.Item>
                {setUserErrors && (
                  <Alert
                    className="login-error-alert"
                    message={setUserErrors}
                    type="error"
                    showIcon
                    closable
                    afterClose={() => this.props.clearError(SET_USER)}
                  />
                )}
                <Form.Item>
                  <Button className="login-form-button" type="primary" htmlType="submit">
                    {loadingLogin ? "Signing in..." : "Sign In"}
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className="login-user-switch-button noselect" onClick={this.handleSwitchUser}>
              Sign in as {this.state.user === "admin" ? "staff" : "admin"} instead
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  ui: state.ui,
});

const mapActionsToProps = {
  loginUser,
  clearError,
};

export default connect(mapStateToProps, mapActionsToProps)(LoginPage);
