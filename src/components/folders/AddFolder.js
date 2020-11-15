import React, { Component } from "react";
import "./Folder.css";
import "./AddFolder.css";
//import PropTypes from "prop-types";

import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

// Redux stuff
import { connect } from "react-redux";
import { createFolder, clearErrors } from "../../redux/actions/dataActions";

class AddFolder extends Component {
  constructor() {
    super();
    this.state = {
      folder: {
        parent: "",
        title: "",
      },
      errors: [],
      showCreateModal: false,
    };
  }
  componentDidMount() {
    var target = this.props.target;
    if (typeof target === "undefined" || target === "") {
      target = "home";
    }
    this.setState({
      ...this.state,
      folder: { ...this.state.folder, parent: target },
    });
  }
  toggleCreateModal = () => {
    this.setState({
      ...this.state,
      showCreateModal: !this.state.showCreateModal,
    });
    console.log(this.state);
  };
  handleChange = (event) => {
    this.setState({
      ...this.state,
      folder: { ...this.state.folder, [event.target.name]: event.target.value },
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.folder.title.length > 0) {
      const newFolder = {
        title: this.state.folder.title,
      };
      this.props.createFolder(this.state.folder.parent, newFolder);
      this.toggleCreateModal();
    } else {
      this.setState({
        ...this.state,
        errors: [{ general: "Folder name should not be blank." }],
      });
    }
  };
  render() {
    var style = this.props.format;
    return (
      <div
        className={
          typeof style === "undefined" || style === 0
            ? "folder folder-add noselect"
            : "add-blank noselect"
        }
      >
        {typeof style === "undefined" || style === 0 ? (
          <div className="fit" onClick={this.toggleCreateModal}>
            <span className="folder-logo">+</span>
            <span className="">Create a folder</span>
          </div>
        ) : (
          <Button type="primary" onClick={this.toggleCreateModal}>
            <span className="">Create a folder</span>
          </Button>
        )}
        {this.state.showCreateModal ? (
          <form className="folder-create-bg" onSubmit={this.handleSubmit}>
            <div className="folder-create center">
              <div className="folder-create-topbar">
                <span>Create New Folder</span>
                <CloseOutlined onClick={this.toggleCreateModal} />
              </div>
              <div className="folder-create-middlebar">
                <input
                  className="folder-create-input"
                  type="text"
                  name="title"
                  required
                  placeholder="Name"
                  maxlength="256"
                  onChange={this.handleChange}
                />
                <span className="errors">
                  {this.state.errors.length > 0
                    ? this.state.errors.pop().general
                    : ""}
                </span>
              </div>
              <div className="folder-create-endbar">
                <Button onClick={this.toggleCreateModal}>Cancel</Button>
                <Button
                  type="primary"
                  onClick={this.handleSubmit}
                  disabled={this.state.folder.title.length <= 0}
                >
                  Create
                </Button>
              </div>
            </div>
          </form>
        ) : (
          ""
        )}
      </div>
    );
  }
}

//AddFolder.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { createFolder, clearErrors })(
  AddFolder
);
