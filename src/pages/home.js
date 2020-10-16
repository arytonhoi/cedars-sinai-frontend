import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import DateHelper from '../util/dateHelper.js';
import Announcement from '../components/announce/Announcement.js';

import { connect } from 'react-redux';
import { getAnnounce } from '../redux/actions/dataActions';

class home extends Component {
  componentDidMount(){
    this.props.getAnnounce()
  }
  render() {
    const { isAdmin , data } = this.props;
    const now = new Date().getTime();
    var announces = data.announce
    announces.sort(
      (a,b) => {
        a.createdAt = new DateHelper(a.createdAt)
        a.createdTs = a.createdAt.getTimestamp()
        b.createdAt = new DateHelper(b.createdAt)
        b.createdTs = b.createdAt.getTimestamp()
        return (a.createdTs < b.createdTs)
      }
    )
    const [pinned, unpinned] = announces.reduce(([p, f], e) => (e.isPinned ? [[...p, e], f] : [p, [...f, e]]), [[], []]);
console.log(pinned,unpinned)
    let pinnedAnn = pinned.map(
      (x,i)=>
        (isAdmin || (now > x.createdTs) )?
          (<Announcement key={i} index={"pa" + i} what={x} pending={false} />):("")
    )
    let unpinnedAnn = unpinned.map(
      (x,i)=>
        (isAdmin || ((now > x.createdTs) && (now - x.createdTs <7776000000)) )?
          (<Announcement key={i} index={"ua" + i} what={x} pending={false} />):("")
    )
    return(
      <div>
      <div>
         <span>
           <h3>Welcome back. {isAdmin ? "You are an admin." : "What would you like to do today?" }</h3>
         </span>
         <span>{new DateHelper().toString()}</span>
      </div>
      {pinnedAnn}
      {unpinnedAnn}
      </div>
    )
  }
}

home.propTypes = {
  getAnnounce: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {console.log(state);return ({
  data: state.data,
  isAdmin: state.user.is_admin
})};

export default connect(
  mapStateToProps,
  { getAnnounce }
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
