import React, { Component } from "react";
import "./Folder.css";
import "./AddFolder.css";
//import PropTypes from "prop-types";

import { Modal, Input, Button } from "antd";

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
            <span className="folder-logo-plus">+</span>
            <span className="">Create a folder</span>
          </div>
        ) : (
          <Button type="primary" onClick={this.toggleCreateModal}>
            <span className="">Create a folder</span>
          </Button>
        )}
        <Modal
          className="center"
          title="Create New Folder"
          visible={this.state.showCreateModal}
          onCancel={() => this.toggleStateFlag("showDeleteConfirm")}
          footer={[
            <Button key="1" onClick={this.toggleCreateModal}>Cancel</Button>,
            <Button
              key="2"
              type="primary"
              onClick={this.handleSubmit}
              disabled={this.state.folder.title.length <= 0}
            >
              Create
            </Button>
          ]}
        >
          <Input
            className="folder-create-input"
            type="text"
            name="title"
            placeholder="Name"
            maxLength="64"
            onChange={this.handleChange}
          />
          <span className="errors">
            {this.state.errors.length > 0
              ? this.state.errors.pop().general
              : ""}
          </span>
        </Modal>
      </div>
    );
  }
}

//AddFolder.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { createFolder, clearErrors })(
  AddFolder
);
