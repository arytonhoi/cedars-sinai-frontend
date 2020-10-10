import { Component } from 'react';

// Redux stuff
import store from '../redux/store';
import { logoutUser } from '../redux/actions/userActions';

class logout extends Component {
  render() {
    store.dispatch(logoutUser());
    window.location.href = '/';
    return ""
  }
}

export default logout
