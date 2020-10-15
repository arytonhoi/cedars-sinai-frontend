import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

// MUI Stuff
import '../css/login.css';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
// Redux stuff
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const styles = (theme) => ({
  ...theme
});

class login extends Component {
  constructor() {
    super();
    this.state = {
      username: 'staff',
      password: '',
      errors: {},
      showPw: false
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
      username: this.state.username,
      password: this.state.password
    };
    this.props.loginUser(userData, this.props.history);
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  togglePwField = (event) => {
    this.setState({
      showPw: !this.state.showPw
    });
  };
  render() {
    const {user, classes, UI: { loading }} = this.props;
console.log(this.props)
    const { errors } = this.state;
    return (
      <div>
          <form class="center" noValidate onSubmit={this.handleSubmit}>
            <input
              id="adminSelect"
              type="radio"
              name="username"
              value="admin"
              class="noselect"
              onChange={this.handleChange}
            />
            <a><label for="adminSelect" class="noselect select-admin">ADMIN <svg height="50" width="40" class="dialog-label">
  <polygon points="20,0 40,50 0,50" style={{fill:"#c4c4c4"}} />
</svg> </label></a>
            <input 
              id="userSelect"
              type="radio"
              name="username"
              value="staff"
              class="noselect"
              onChange={this.handleChange}
            />
            <a><label for="userSelect" class="noselect select-user">USER  <svg height="50" width="40" class="dialog-label">
  <polygon points="20,0 40,50 0,50" style={{fill:"#c4c4c4"}} />
</svg> </label></a>
            <span value={ errors }></span>
            <div class="login-wrapper">
            <TextField
              id="password"
              name="password"
              type={this.state.showPw ? "text" : "password"}
              placeholder="Password"
              style={{background: "#c4c4c4", padding: "0.5em 0", "border-radius":"0.5em"}}
              className={classes.textField}
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
              disableUnderline
            />
            <span class="key-icon valign noselect">Key</span>
            <span class="pw-toggle valign noselect" onClick={this.togglePwField}>Eye</span>
            </div>
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{background:"linear-gradient(90deg, #999, #434343)"}}
              className={classes.button}
              fullWidth
              disabled={loading}
            >
              Sign In
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
          </form>
      </div>
    );
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  showPw: state.showPw,
  UI: state.UI
});

const mapActionsToProps = {
  loginUser
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(login));
