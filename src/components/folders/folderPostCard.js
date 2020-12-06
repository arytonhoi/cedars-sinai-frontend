import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { patchFolder } from "../../redux/actions/dataActions";

// components
import CKEditor from "ckeditor4-react";

// css
import "../../css/page.css";

//HTML handling
import parse from "html-react-parser";

// Ant Design
import { Button, Layout, Modal } from "antd";
const { Content } = Layout;

class FolderPostCard extends Component {
  constructor() {
    super();
    this.state = {
      // editor

      editor: null,
      // modals
      showPostCancelConfirm: false,
      errors: {},
    };
  }

  // toggles
  toggleEditingPost = () => {
    this.setState({
      editor: null,
      showPostCancelConfirm: false,
    });
    this.props.toggleEditingPost();
  };

  maybeShowPostCancelConfirm = () => {
    this.state.editor === null
      ? this.toggleEditingPost()
      : this.setState({
          showPostCancelConfirm: true,
        });
  };

  // update functions
  updateEditor = (event) => {
    this.setState({ editor: event.editor.getData() });
  };

  // action functions
  saveEditorChanges = () => {
    if (this.state.editor !== null) {
      const updatedFolder = this.props.folder;
      updatedFolder.content = this.state.editor;
      this.props.patchFolder(this.props.pagename, updatedFolder);
    }
    this.toggleEditingPost();
  };

  clearPost = () => {
    const updatedFolder = this.props.folder;
    updatedFolder.content = "";
    this.props.patchFolder(this.props.pagename, updatedFolder);
    this.toggleEditingPost();
  };

  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const folder = this.props.folder;

    return (
      <Content className="content-card">
        <Modal
          className="center"
          title={"Cancel changes to your post?"}
          visible={this.state.showPostCancelConfirm}
          footer={[
            <Button
              key="cancel"
              onClick={() => this.setState({ showPostCancelConfirm: false })}
            >
              No
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                this.setState({ showPostCancelConfirm: false });
                this.props.toggleEditingPost();
              }}
            >
              Yes, Cancel Changes
            </Button>,
          ]}
        >
          This will remove all new changes made to your post.
        </Modal>
        {isAdmin && (
          <div className="content-card-header">
            <div className="header-row">
              <span key="space" />
              {this.props.isEditingPost ? (
                <span className="page-header-interactive-items">
                  <Button type="danger" onClick={this.clearPost}>
                    Delete entire post
                  </Button>
                  <Button onClick={this.maybeShowPostCancelConfirm}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    style={{
                      background: "#52C41A",
                      borderColor: "#52C41A",
                    }}
                    // disabled={
                    //   this.state.editor === null || this.state.editor === ""
                    // }
                    onClick={this.saveEditorChanges}
                  >
                    Save Changes
                  </Button>
                </span>
              ) : (
                <span className="page-header-interactive-items">
                  <Button
                    type="primary"
                    disabled={this.props.isEditingFolders}
                    onClick={this.props.toggleEditingPost}
                  >
                    Edit Post
                  </Button>
                </span>
              )}
            </div>
          </div>
        )}
        <div className="padded-content-card-content">
          {this.props.isEditingPost ? (
            <CKEditor
              data={folder.content}
              onChange={this.updateEditor}
              config={{
                disallowedContent: "script embed *[on*]",
                removeButtons: "",
                height: "38vh",
              }}
            />
          ) : folder.content === "" ? (
            <div className="folder-blank noselect">
              <h3 className="em2">
                It seems like there is no post for this folder yet.
              </h3>
              <h4 className="em3">Start by creating the post.</h4>
              <Button type="primary" onClick={this.props.toggleEditingPost}>
                Begin Post
              </Button>
            </div>
          ) : (
            <div>{parse(folder.content)}</div>
          )}
        </div>
      </Content>
    );
  }
}

FolderPostCard.propTypes = {
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    UI: state.UI,
  };
};

export default connect(mapStateToProps, {
  patchFolder,
})(FolderPostCard);
