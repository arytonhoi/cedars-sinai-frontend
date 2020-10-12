import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import { connect } from 'react-redux';
import { getPost } from '../redux/actions/dataActions';

class genpage extends Component {
  componentDidMount() {
    const pageName = this.props.match.params.pageName;
    this.props.getPost(pageName);
  }
  render() {
    const { UI, data, user } = this.props;
    const posts = data.posts;
    const pageMarkup = (data.loading || (posts.length == 0 && UI.errors.length == 0) ) ? (
      <p>Page loading...</p>
    ) : ( UI.errors.length > 0) ? (
      <p>{UI.errors[0].statusText}</p>
    ) : ( !user.is_admin && posts[0].adminOnly) ? (
      <p>Not authorised to view this text.</p>
    ) : (
      <p>Page loaded, title is {posts[0].title}, content is {JSON.stringify({"a":posts[0].content})}, modified is {posts[0].lastModified}, full response is {JSON.stringify({"a":posts[0]})} </p>
    );

    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          {pageMarkup}
        </Grid>
      </Grid>
    );
  }
}

genpage.propTypes = {
  getPost: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data,
  user: state.user,
  UI: state.UI
});

export default connect(
  mapStateToProps,
  { getPost }
)(genpage);
