import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "../css/genPage.css";
import Folder from '../components/folders/Folder.js';
import AddFolder from '../components/folders/AddFolder.js';

import { Button } from "antd";

import { connect } from 'react-redux';
import { getFolder, updateFolder } from '../redux/actions/dataActions';

// Editor
import CKEditor from 'ckeditor4-react';

//HTML handling
import parse from 'html-react-parser'

class genPage extends Component {
  constructor(){
    super();
    this.state = {
      pagename: "",
      editFolders: false,
      editPost: false,
      editor: "",
      selectedFolders: []
    }
  }
  componentDidMount() {
    var pageName = this.props.match.params.pageName;
    if(typeof(pageName) !== 'string' || pageName === ""){
      pageName = "home";
    }
    this.props.getFolder(pageName);
    this.setState({...this.state, pagename: pageName})
  }
  toggleFolderEditable = (event) => {
    this.setState({...this.state, editFolders: !this.state.editFolders && this.props.user.credentials.isAdmin})
  }
  togglePostEditable = (event) => {
    this.setState({...this.state, editPost: !this.state.editPost && this.props.user.credentials.isAdmin})
  }
  updateEditor = (event) => {
    this.setState({...this.state, editor:event.editor.getData()});
  };
  saveEditorChanges = (event) => {
    this.props.updateFolder(this.state.pagename,{
      parent: this.props.data.data[0].parent,
      title: this.props.data.data[0].title,
      content: this.state.editor
    });
    this.togglePostEditable()
  };
  clearPost = (event) => {
    this.props.updateFolder(this.state.pagename,{
      parent: this.props.data.data[0].parent,
      title: this.props.data.data[0].title,
      content: ""
    });
    this.togglePostEditable()
  };
  render() {
    const { UI, data, user } = this.props;
    const pageName = this.props.match.params.pageName;
    const folders = data.data[0];
    var s = "s"
    if(this.state.selectedFolders.length === 1){s=""}
    const pageMarkup = (data.loading || (data.data.length === 0 && UI.errors.length === 0) ) ? (
      <p>Page loading...</p>
    ) : ( UI.errors.length > 0) ? (
      <p>{UI.errors[0].statusText}</p>
    ) : ( !user.credentials.isAdmin && folders.adminOnly) ? (
      <p>Not authorised to view this text.</p>
    ) : (
      <div>
        {(this.state.editPost)?(
          <div className="resources-editbar">
            <span className="button-holder">
              <Button type="danger" onClick={this.clearPost}>Delete Contents</Button>
            </span>
            <span className="button-holder">
              <Button onClick={this.togglePostEditable}>Cancel</Button>
              <Button type="primary" onClick={this.saveEditorChanges}>Save Changes</Button>
            </span>
          </div>):("")
        }
        {(this.state.editFolders)?(
          <div className="resources-editbar">
            <span className="button-holder">
              <Button disabled={this.state.selectedFolders.length === 0} type="danger" onClick={this.toggleFolderEditable}>Delete {this.state.selectedFolders.length} Folder{s}</Button>
              <Button disabled={this.state.selectedFolders.length === 0} onClick={this.toggleFolderEditable}>Move {this.state.selectedFolders.length} Folder{s}</Button>
              <Button disabled={this.state.selectedFolders.length === 0} onClick={this.toggleFolderEditable}>Rename {this.state.selectedFolders.length} Folder{s}</Button>
            </span>
            <span className="button-holder">
              <Button type="primary" onClick={this.toggleFolderEditable}>Done Editing</Button>
            </span>
          </div>):("")
        }
        <div className="resources-topbar">
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
          <h3>{folders.title}</h3>
        </div>
        <div className="floating-component">
          <div className="folder-topbar">
            <h3>Contents</h3>
            {
              ( user.credentials.isAdmin && !this.state.editFolders && !this.state.editPost ) ? (
                <Button type="primary" onClick={this.toggleFolderEditable}>Edit Folders</Button>
              ):("")
            }
          </div>
          <div className="folder-holder">
          {
            ( folders.subfolders.length > 0) ? (
              folders.subfolders.map(
                (x,i) => (
                  <Folder key={x.id} label={x.title} href={x.id} />
                )
              )
            ):("")
          }
          {
            ( user.credentials.isAdmin && this.state.editFolders ) ? (
              <AddFolder target={pageName}/>
            ):("")
          }
          </div>
          <hr />
          {( user.credentials.isAdmin && !this.state.editPost && !this.state.editFolders ) ? (
            <div className="post-topbar">
              <Button type="primary" onClick={this.togglePostEditable}>Edit Post</Button>
            </div>
          ):("")}
          {(this.state.editPost)?(
            <CKEditor 
              data={folders.content}
              onChange = { this.updateEditor }
              config={{
                disallowedContent : 'script embed *[on*]',
                removeButtons : "",
                toolbar : [{
                  name:"Basic",
                  items:["Bold","Italic","Underline","Superscript","Subscript","Link", "Image"]
                }]
              }}
            />
            ):(parse(folders.content))
          }
        </div>
      </div>
    );

    return (
      <div>
        {pageMarkup}
      </div>
    );
  }
}

genPage.propTypes = {
  getFolder: PropTypes.func.isRequired,
  updateFolder: PropTypes.func.isRequired,
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
  { getFolder, updateFolder }
)(genPage);
