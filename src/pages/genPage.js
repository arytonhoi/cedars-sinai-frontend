import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "../css/genPage.css";
import Folder from '../components/folders/Folder.js';
import AddFolder from '../components/folders/AddFolder.js';
import Grid from '@material-ui/core/Grid';

import { connect } from 'react-redux';
import { getFolder } from '../redux/actions/dataActions';

class genPage extends Component {
  constructor(){
    super();
    this.state = {
      editable: false
    }
  }
  componentDidMount() {
    const pageName = this.props.match.params.pageName;
    if(typeof(pageName) === 'string' && pageName !== ""){
      this.props.getFolder(pageName);
    }else{
      this.props.getFolder("home");
    }
  }
  toggleEditable(event){
    this.setState({editable: !this.state.editable})
  }
  render() {
console.log(this.state)
console.log(this.props)
    const { UI, data, user } = this.props;
    const pageName = this.props.match.params.pageName;
    const folders = data.data[0];
    const pageMarkup = (data.loading || (data.data.length === 0 && UI.errors.length === 0) ) ? (
      <p>Page loading...</p>
    ) : ( UI.errors.length > 0) ? (
      <p>{UI.errors[0].statusText}</p>
    ) : ( !user.credentials.isAdmin && folders.adminOnly) ? (
      <p>Not authorised to view this text.</p>
    ) : (
      <div>
        <h5><span><a href="/resources">Resources</a></span>{
          (typeof(folders.path)==="object")?
          (folders.path.map(
            (x,i) => (
              (x!=="" && x!=="home")?
              (<span> / <a href={x}>{x}</a></span>):
              ("")
            )
          )):
          ("")
        }<span> / {folders.title}</span></h5>
        <span>
          <span>{folders.title}</span>
          <input type="button" value="Edit?" onClick={this.toggleEditable}/>
        </span>
        <div className="folder-holder">
        {
          ( folders.subfolders.length > 0) ? (
            folders.subfolders.map(
              (x,i) => (
                <Folder key={x.title} label={x.title} href="Not supported" />
              )
            )
          ):("")
        }
        {
          ( user.credentials.isAdmin ) ? (
            <AddFolder target={pageName}/>
          ):("")
        }
        </div>
        <hr />
        {folders.content}
      </div>
    );

    return (
      <Grid>
        {(this.state.editable)?("I'm editable"):("Cannot edit")}
        {pageMarkup}
      </Grid>
    );
  }
}

genPage.propTypes = {
  getFolder: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  editable: state.editable,
  data: state.data,
  user: state.user,
  UI: state.UI
});

export default connect(
  mapStateToProps,
  { getFolder }
)(genPage);
