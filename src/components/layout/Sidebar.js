import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from '../../util/jsx/MyButton';
import AddPost from '../posts/AddPost';
// MUI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
// Icons
import HomeIcon from '@material-ui/icons/Home';
import LogoutIcon from '@material-ui/icons/PowerOff';

class Sidebar extends Component {
  render() {
    const { isAdmin } = this.props;
    return (
      <AppBar>
        <Toolbar className="nav-container">
          {isAdmin ? (
            <Fragment>
              <AddPost />
              <Link to="/">
                <MyButton tip="Home">
                  <HomeIcon />
                </MyButton>
              </Link>
              <Link to="/logout">
                <MyButton tip="Logout">
                  <LogoutIcon />
                </MyButton>
              </Link>
            </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/logout">
                Logout
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Sidebar.propTypes = {
  isAdmin: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  isAdmin: state.user.is_admin
});
export default connect(mapStateToProps)(Sidebar);
