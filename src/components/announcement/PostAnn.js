import React, { Component } from 'react';
import './PostAnn.css';
//import PropTypes from 'prop-types';

import { Button } from "antd";

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
    this.setState({...this.state,ann:{...this.state.ann, isPinned: (this.state.ann.isPinned === "on")}})
    if(this.state.ann.title !== '' && this.state.ann.content !== ''){
      this.props.postAnnouncement(this.state.ann);
    }else{
      this.errors = {"error":"Blank post"}
    }
  };
  updateEditor = (event) => {
    this.setState({...this.state,ann:{...this.state.ann, content: event.editor.getData()}});
  };
  handleChange = (event) => {
    this.setState({...this.state,ann:{...this.state.ann, [event.target.name]: event.target.value}});
  };
  render(){
//  console.log(this.state);console.log(this.props);
//we need removeButtons or else underline will be disabled
    return (
      <form className="floating-component" onSubmit={this.handleSubmit}>
        <h3>Post New Announcement</h3>
        <input className="ann-input" name="author" type="text" onChange = { this.handleChange } placeholder="Name" /><br />
        <input className="ann-input" name="title" type="text" placeholder="Enter a title..." onChange = { this.handleChange } /><br />
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
        <div className="ann-form-bottom">
          <span>Pin post? <input type="checkbox" name="isPinned" onChange = { this.handleChange }/></span>
          <Button className="ann-form-submit" type="primary" variant="contained" onClick={this.handleSubmit}>Post</Button>
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { postAnnouncement, clearErrors })(PostAnn);