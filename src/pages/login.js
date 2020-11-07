import React, { Component } from "react";
import PropTypes from "prop-types";

// MUI Stuff
import "../css/login.css";
import { Button, Spin } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"
// Redux stuff
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";

class login extends Component {
  constructor() {
    super();
    this.state = {
      uid: 1,
      password: "",
      errors: {},
      showPw: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      username: ["admin","staff"][this.state.uid],
      password: this.state.password,
    };
    this.props.loginUser(userData, this.props.history);
  };
  handleChange = (event) => {
    this.setState({
      ...this.state,
      uid: (this.state.uid+1)%2,
    });
  };
  handleTextChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  togglePwField = (event) => {
    this.setState({
      showPw: !this.state.showPw,
    });
  };
  render() {
    const {
      UI: { loading },
    } = this.props;
    const { errors } = this.state;
    return (
      <div className="noselect">
        <div className="logo-box" >
          <img className="logo" src={process.env.PUBLIC_URL + '/logo.png'} alt=""/>
        </div>
        <form className="login-form center" noValidate onSubmit={this.handleSubmit}>
          <p className="login-title">OR Education Portal</p>
          <div className="pw-field-wrapper">
            <span>Enter Password:</span>
            <input
              id="password"
              name="password"
              className="pw-input"
              type={this.state.showPw ? "text" : "password"}
              style={{
                padding: "0.5em 0",
                borderRadius: "0.5em",
              }}
              value={this.state.password}
              onChange={this.handleTextChange}
            />

            <span
              className="pw-toggle valign noselect"
              onClick={this.togglePwField}
            >
              {(this.state.showPw)?(<EyeInvisibleOutlined />):(<EyeOutlined />)}
            </span>
          </div>
          <p className="pw-errors noselect">{
            (errors.length > 0)?(errors.pop().general):(<br/>)
          }</p>
          <Button
            type="primary"
            variant="contained"
            style={{width: "100%"}}
            className="button"
            disabled={loading}
            onClick={this.handleSubmit}
          >
            Sign In
            {loading && (<Spin className="button-spinner halign" />)}
          </Button>
          <div className="noselect select-user" onClick={this.handleChange}>
            Sign in as {["staff","admin"][this.state.uid]} instead
          </div>
        </form>
      </div>
    );
  }
}

login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  showPw: state.showPw,
  UI: state.UI,
});

const mapActionsToProps = {
  loginUser,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(login);
