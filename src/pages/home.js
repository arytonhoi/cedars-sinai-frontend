import { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/dataActions';

class home extends Component {
  render() {
    const { isAdmin } = this.props;
    if(isAdmin){
      return "Homepage for admins"
    }else{
      return "Not admin"
    }
  }
}

home.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {console.log(state);return ({
  data: state.data,
  isAdmin: state.user.is_admin
})};

export default connect(
  mapStateToProps,
  { getPosts }
)(home);

/*
  componentDidMount() {
    this.props.getScreams();
  }
    const { screams, loading } = this.props.data;
    let recentScreamsMarkup = !loading ? (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      <ScreamSkeleton />
    );
    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          {recentScreamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
*/
