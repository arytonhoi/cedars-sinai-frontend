import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { clearErrors } from "../../redux/actions/dataActions";

// Ant design
import { Row, Col, Input, Form, Button } from "antd";

// class
import "./admin.css";

class PasswordChangeSection extends Component {
  // formRef = React.createRef();

  testOnChange = (event) => {
    // const form = this.formRef.current
    // const values = form.getFieldValue(["Current Password"]);
    console.log("Hello");
  };

  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;

    return (
      <div className="passwordComponent">
        <header className="passwordHeader">
          <h2>Password Information</h2>
        </header>
        <div className="passwordAreas">
          <Row justify="start" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={6}>
              <h3 className="passwordSubItemsHeader">Admin</h3>
              <Form layout="vertical">
                <Form.Item
                  name="Current Password"
                  label="Current Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your current password!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password onChange={this.testOnChange()} />
                </Form.Item>

                <Form.Item
                  name="New Password"
                  label="New Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your new password!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label="Confirm Password"
                  dependencies={["New Password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue("New Password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "The two passwords that you entered do not match!"
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    // xs: { span: 24, offset: 0 },
                    sm: { span: 6, offset: 10 },
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Change Password
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col span={6}>
              <h3 className="passwordSubItemsHeader">Staff</h3>
              <Form layout="vertical">
                <Form.Item
                  name="Current Password"
                  label="Current Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your current password!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="New Password"
                  label="New Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your new password!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label="Confirm Password"
                  dependencies={["New Password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue("New Password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "The two passwords that you entered do not match!"
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    // xs: { span: 24, offset: 0 },
                    sm: { span: 6, offset: 10 },
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Change Password
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

PasswordChangeSection.propTypes = {
  //   contacts: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { clearErrors })(PasswordChangeSection);
