import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "../css/genPage.css";
import Folder from '../components/folders/Folder.js';
import AddFolder from '../components/folders/AddFolder.js';

import { Modal, Button } from "antd";

import { connect } from 'react-redux';
import { getFolder, deleteFolder, updateFolder, updateSubFolder } from '../redux/actions/dataActions';

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
      showPostCancelConfirm: false,
      showRenameConfirm: false,
      showDeleteConfirm: false,
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
    this.setState({
      ...this.state,
      selectedFolders:[],
      editFolders: !this.state.editFolders && this.props.user.credentials.isAdmin
    })
  }
  togglePostEditable = (event) => {
    this.setState({
      ...this.state,
      selectedFolders:[],
      editPost: !this.state.editPost && this.props.user.credentials.isAdmin,
      showPostCancelConfirm: false
    })
  }
  toggleStateFlag = (x) => {
    this.setState({
      ...this.state,
      [x]: !this.state[x]
    })
  }
  toggleSelect = (e, x) => {
    var folders = this.state.selectedFolders
    var pos = folders.findIndex(p=>p.id===x.id)
    if(pos >= 0){
      folders = folders.slice(0,pos).concat(folders.slice(pos+1))
      x.hit.className = "folder folder-normal noselect"
    }else{
      x.hit = e.currentTarget
      folders.push({...x})
      e.currentTarget.className = "folder folder-selected noselect"
    }
    this.setState({...this.state, selectedFolders: folders})
  }
  renameFolderCallback = (e) => {
    var folders = this.state.selectedFolders
    folders[e.target.name].title = e.target.value
    this.setState({...this.state, selectedFolders: folders})
  }
  renameFolders = () => {
    if(this.state.showRenameConfirm){
      var folders = this.state.selectedFolders
      if(folders.length >= 0){
        folders.map(x=>{
            this.toggleSelect(null,x)
            this.props.updateSubFolder(x.id,{
              parent: x.parent,
              title: x.title,
              content: x.content
            })
            return 0
          }
        )
      }
    }
    this.setState({...this.state, showRenameConfirm:false, selectedFolders: []})
  }
  deleteFolders = () => {
    this.setState({...this.state, showDeleteConfirm:false, selectedFolders: []})
    if(this.state.showDeleteConfirm){
      let folders = this.state.selectedFolders
      if(folders.length >= 0){
        folders.map(x=>this.props.deleteFolder(x.id))
      }
    }
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
              <Button onClick={()=>this.toggleStateFlag("showPostCancelConfirm")}>Cancel</Button>
              <Button type="primary" onClick={this.saveEditorChanges}>Save Changes</Button>
            </span>
            <Modal
              title={"Cancel changes to your post?"}
              visible={this.state.showPostCancelConfirm}
              onCancel={()=>this.toggleStateFlag("showPostCancelConfirm")}
          footer={[
            <Button key="1" onClick={()=>this.toggleStateFlag("showPostCancelConfirm")}>No</Button>,
            <Button key="2" type="primary" onClick={this.togglePostEditable}>Yes, Cancel Changes</Button>,
          ]}
            >
              This will remove all new changes made to your post.
            </Modal>
          </div>):("")
        }
        {(this.state.editFolders)?(
          <div className="resources-editbar">
            <span className="button-holder">
              <Button disabled={this.state.selectedFolders.length === 0} type="danger" onClick={()=>this.toggleStateFlag("showDeleteConfirm")}>Delete {this.state.selectedFolders.length} Folder{s}</Button>
              <Button disabled={this.state.selectedFolders.length === 0} onClick={this.toggleFolderEditable}>Move {this.state.selectedFolders.length} Folder{s}</Button>
              <Button disabled={this.state.selectedFolders.length === 0} onClick={()=>this.toggleStateFlag("showRenameConfirm")}>Rename {this.state.selectedFolders.length} Folder{s}</Button>
            </span>
            <Modal
              title="Are you sure?"
              visible={this.state.showDeleteConfirm}
              onCancel={()=>this.toggleStateFlag("showDeleteConfirm")}
          footer={[
            <Button key="1" onClick={()=>this.toggleStateFlag("showDeleteConfirm")}>No</Button>,
            <Button key="2" type="danger" onClick={this.deleteFolders}>Yes, delete folder{s}</Button>,
          ]}
            >
              Deleting {this.state.selectedFolders.map((x,i,a)=>(
                (a.length===1)?(x.title):(
                  (a.length-i===1)?(" and "+x.title):(
                    (i<(a.length-2))?(x.title + ", "):(x.title + " ")
                  )
                )
              ))} will remove all contents, including files and subfolders within the folder{s}. This action is irreversible.
            </Modal>
            <Modal
              title={"Rename folder"+s}
              visible={this.state.showRenameConfirm}
              onCancel={()=>this.toggleStateFlag("showRenameConfirm")}
          footer={[
            <Button key="1" onClick={()=>this.toggleStateFlag("showRenameConfirm")}>Cancel</Button>,
            <Button key="2" type="primary" onClick={this.renameFolders}>Rename</Button>,
          ]}
            >
              {this.state.selectedFolders.map((x,i,a)=>(
                <input key={i} className="full-width" type="text" value={x.title} name={i} onChange={this.renameFolderCallback}/>  
              ))}
            </Modal>
            <span className="button-holder">
              <Button type="primary" onClick={this.toggleFolderEditable}>Exit Folder Edit Mode</Button>
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
                  <Folder key={x.id} label={x.title}
                    href={
                      ( user.credentials.isAdmin && this.state.editFolders )?
                      ((e)=>this.toggleSelect(e,x)):(x.id)
                    }
                  />
                )
              )
            ):("")
          }
          {
            ( user.credentials.isAdmin && this.state.editFolders ) ? (
              <AddFolder target={pageName} />
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
            ):(<div className="folder-post">{parse(folders.content)}</div>)
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
  deleteFolder: PropTypes.func.isRequired,
  updateFolder: PropTypes.func.isRequired,
  updateSubFolder: PropTypes.func.isRequired,
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
  { getFolder, updateFolder, updateSubFolder, deleteFolder }
)(genPage);
