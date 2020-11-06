import React, { Component } from "react";
import "./Folder.css";
import "./AddFolder.css";
//import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { createFolder, clearErrors } from "../../redux/actions/dataActions";

class AddFolder extends Component {
  constructor() {
    super();
    this.state = {
      folder:{
        parent: "",
        title: ""
      },
      errors:{}
    }
  };
  componentDidMount() {
    var target = this.props.target
    if(typeof(target) === "undefined" || target === ""){target = "home"}
    this.setState({...this.state,folder:{...this.state.folder, parent:target}});
  }
  handleChange = (event) => {
    this.setState({
      folder:{
        parent : this.state.folder.parent,
        [event.target.name] : event.target.value
      }
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const newFolder = {
      title: this.state.folder.title,
    };
    this.props.createFolder(this.state.folder.parent, newFolder);
  }
  render() {
    return(
      <div className="folder">
        <label className="folder-link folder-add" htmlFor="folderCreateToggle" >
          <span className="folder-logo">+</span>
          <span className="folder-label">Create New Folder</span>
        </label>
        <input type="checkbox" id="folderCreateToggle" />
        <form className="folder-create-bg" onSubmit={this.handleSubmit}>
          <div className="folder-create">          
            <div className="folder-create-topbar">
              <span>Create New Folder</span>
              <label htmlFor="folderCreateToggle">X</label>
            </div>
           <span className="create-errors">{JSON.stringify(this.state.errors)}</span>
            <input type="text" name="title" required placeholder="Input something..." onChange={this.handleChange}/>
            <div>
              <label htmlFor="folderCreateToggle">Cancel</label>
              <input type="submit" value="Submit" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

//AddFolder.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { createFolder, clearErrors })(
  AddFolder
);
