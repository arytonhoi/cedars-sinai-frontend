import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { PATCH_FOLDER } from "../../redux/types";
import { patchFolder } from "../../redux/actions/folderActions";
import { clearError } from "../../redux/actions/uiActions";

// components
import CKEditor from "ckeditor4-react";
import { ckConfig } from "../../util/configs/ckeditor";

// css
import "../../css/page.css";

//HTML handling
import parse from "html-react-parser";

// Ant Design
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Layout, Modal, notification, Spin } from "antd";
const { Content } = Layout;

class FolderPostCard extends Component {
  constructor() {
    super();
    this.state = {
      // editor

      editor: null,
      // modals
      showPostCancelConfirm: false,
    };
  }

  componentDidUpdate(prevProps) {
    // render action progress and errors
    let currentErrors = this.props.ui.errors;
    let currentloadingActions = this.props.ui.loadingActions;
    let previousLoadingActions = prevProps.ui.loadingActions;
    let previousLoadingActionNames = Object.keys(previousLoadingActions);

    previousLoadingActionNames.forEach((actionName) => {
      if (
        !currentloadingActions[actionName] &&
        previousLoadingActions[actionName]
      ) {
        // if preivousLoadingAction is no longer loading
        switch (actionName) {
          // departments
          case PATCH_FOLDER:
            notification.close(PATCH_FOLDER);
            currentErrors[actionName]
              ? notification["error"]({
                  message: "Failed to update post",
                  description: currentErrors[actionName],
                  duration: 0,
                  onClose: () => {
                    clearError(PATCH_FOLDER);
                  },
                })
              : notification["success"]({
                  message: "Post updated!",
                });
            break;
          default:
            break;
        }
      }
    });
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
    notification.open({
      key: PATCH_FOLDER,
      duration: 0,
      message: "Updating post...",
      icon: <LoadingOutlined />,
    });
    console.log(this.props.currentFolderId);
    if (this.state.editor !== null) {
      const updatedFolder = this.props.folder;
      updatedFolder.content = this.state.editor;
      this.props.patchFolder(this.props.currentFolderId, updatedFolder);
    }
    this.toggleEditingPost();
  };

  clearPost = () => {
    const updatedFolder = this.props.folder;
    updatedFolder.content = "";
    this.props.patchFolder(this.props.currentFolderId, updatedFolder);
    this.toggleEditingPost();
  };

  render() {
    const { isAdmin } = this.props.user;
    const { loadingActions } = this.props.ui;

    const folder = this.props.folder;
    return (
      <Content className="content-card folder-post">
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
        {loadingActions.SET_FOLDER && (
          <div className="padded-content vertical-content">
            <Spin style={{ marginTop: "48px" }} />
          </div>
        )}
        {!loadingActions.SET_FOLDER && (
          <div className="padded-content-card-content">
            {this.props.isEditingPost ? (
              <CKEditor
                data={folder.content}
                onChange={this.updateEditor}
                config={ckConfig}
              />
            ) : folder.content === "" ? (
              <div className="folder-blank noselect">
                <h3 className="em2">
                  It seems like there is no post for this folder yet.
                </h3>
                <h4 className="em3">Start by creating the post.</h4>
                <Button
                  type="primary"
                  disabled={this.props.isEditingFolders}
                  onClick={this.props.toggleEditingPost}
                >
                  Begin Post
                </Button>
              </div>
            ) : (
              <div>{parse(folder.content)}</div>
            )}
          </div>
        )}
      </Content>
    );
  }
}

FolderPostCard.propTypes = {
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  clearError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    ui: state.ui,
  };
};

export default connect(mapStateToProps, {
  patchFolder,
  clearError,
})(FolderPostCard);
