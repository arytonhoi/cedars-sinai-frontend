import React, { Component } from 'react';
import './PostAnn.css';
//import PropTypes from 'prop-types';

// Redux stuff
import { connect } from 'react-redux';
import { postAnnouncement, clearErrors } from '../../redux/actions/dataActions';

// Editor
import CKEditor from 'ckeditor4-react';

class PostAnn extends Component{
  state = {
    ann:{
      title: '',
      author: 'Krystal',
      content: '',
      isPinned: false,
    },
    errors: {}
  };
  handleSubmit = (event) => {
    event.preventDefault();
console.log(this.state.ann)
    this.state.ann.isPinned = (this.state.ann.isPinned === "on")
    if(this.state.ann.title !== '' && this.state.ann.content !== ''){
      this.props.postAnnouncement(this.state.ann);
    }else{
      this.errors = {"error":"Blank post"}
    }
  };
  updateEditor = (event) => {
    this.state.ann.content = event.editor.getData()
  };
  handleChange = (event) => {
    this.state.ann[event.target.name] = event.target.value ;
  };
  render(){
//  console.log(this.state);console.log(this.props);
//we need removeButtons or else underline will be disabled
    return (
      <form className="post-ann shadow" onSubmit={this.handleSubmit}>
        <input name="title" type="text" placeholder="Enter a title..." onChange = { this.handleChange } /><br />
        <CKEditor 
          data="Share an announcement"
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
        <br />
        Posting as <select name="author" onChange = { this.handleChange }>
          <option value="Krystal">Krystal</option>
        </select>
        <br />
        Pin post? <input type="checkbox" name="isPinned" onChange = { this.handleChange }/>
        <br />
        <input type="reset" value="Clear" />
        <input type="submit" value="Post Announcement" />
      </form>
    )
  }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { postAnnouncement, clearErrors })(PostAnn);
