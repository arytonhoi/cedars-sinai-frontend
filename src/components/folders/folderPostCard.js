import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { patchUserPassword } from "../../redux/actions/userActions";

// components
import CKEditor from "ckeditor4-react";

// css
import "../../css/page.css";

//HTML handling
import parse from "html-react-parser";

// Ant Design
import { Button, Layout } from "antd";
const { Content } = Layout;

class FolderPostCard extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
    };
  }

  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const folders = this.props.folders;

    return (
      <Content className="content-card">
        {isAdmin && (
          <div className="content-card-header">
            <div className="header-row">
              <span key="space" />
              {this.props.editPost ? (
                <span className="page-header-interactive-items">
                  <Button type="danger" onClick={this.props.clearPost}>
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
                    disabled={
                      this.props.editor === null || this.props.editor === ""
                    }
                    onClick={this.props.saveEditorChanges}
                  >
                    Save Changes
                  </Button>
                </span>
              ) : (
                <span className="page-header-interactive-items">
                  <Button
                    type="primary"
                    onClick={this.props.togglePostEditable}
                  >
                    Edit Post
                  </Button>
                </span>
              )}
            </div>
          </div>
        )}
        <div className="padded-content-card-content">
          {this.props.editPost ? (
            <CKEditor
              data={folders.content}
              onChange={this.props.updateEditor}
              config={{
                disallowedContent: "script embed *[on*]",
                removeButtons: "",
                height: "38vh",
              }}
            />
          ) : folders.content === "" ? (
            <div className="folder-blank noselect">
              <h3 className="em2">
                It seems like there is no post for this folder yet.
              </h3>
              <h4 className="em3">Start by creating the post.</h4>
              <Button type="primary" onClick={this.props.togglePostEditable}>
                Begin Post
              </Button>
            </div>
          ) : (
            <div>{parse(folders.content)}</div>
          )}
        </div>
      </Content>
    );
  }
}

FolderPostCard.propTypes = {
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  folders: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    UI: state.UI,
  };
};

export default connect(mapStateToProps, {
  patchUserPassword,
})(FolderPostCard);
