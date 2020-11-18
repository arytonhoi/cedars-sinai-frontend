import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { postAnnouncement, clearErrors } from "../../redux/actions/dataActions";

// Editor
import CKEditor from "ckeditor4-react";

// styles
import "./PostAnn.css";
import "../../css/textContent.css";
import "../../css/layout.css";

// Antd
import { Button, Form, Input } from "antd";

class AnnouncementPostEditor extends Component {
  state = {
    ann: {
      title: "",
      author: "Krystal",
      content: "",
      isPinned: false,
    },
    errors: {},
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state.ann);
    this.setState({
      ...this.state,
      ann: { ...this.state.ann, isPinned: this.state.ann.isPinned === "on" },
    });
    if (this.state.ann.title !== "" && this.state.ann.content !== "") {
      this.props.postAnnouncement(this.state.ann);
    } else {
      this.errors = { error: "Blank post" };
    }
  };

  updateEditor = (event) => {
    this.setState({
      ...this.state,
      ann: { ...this.state.ann, content: event.editor.getData() },
    });
  };

  handleChange = (event) => {
    this.setState({
      ...this.state,
      ann: { ...this.state.ann, [event.target.name]: event.target.value },
    });
  };

  render() {
    //  console.log(this.state);console.log(this.props);
    //we need removeButtons or else underline will be disabled
    return (
      <div
        className="double-padded-content-container"
        style={{ marginBottom: "15px" }}
      >
        <h2 className="section-header">Post New Announcement</h2>
        <Form layout="vertical">
          {/* <input
            className="ann-input"
            name="author"
            type="text"
            onChange={this.handleChange}
            placeholder="Name"
          />
          <br />
          <input
            className="ann-input"
            name="title"
            type="text"
            placeholder="Enter a title..."
            onChange={this.handleChange}
          />
          <br /> */}
          <Form.Item>
            <Input
              id="contactName"
              name="contactName"
              type="text"
              value={this.props.contactName}
              onChange={this.props.handleChange}
              placeholder="Title"
            />
          </Form.Item>
          <Form.Item>
            <Input
              id="contactName"
              name="contactName"
              type="text"
              value={this.props.contactName}
              onChange={this.props.handleChange}
              placeholder="Author"
            />
          </Form.Item>
          <CKEditor
            // data="Share an announcement"
            onChange={this.updateEditor}
            style={{ marginBottom: "15px" }}
            config={{
              disallowedContent: "script embed *[on*]",
              removeButtons: "",
              toolbar: [
                {
                  name: "Basic",
                  items: [
                    "Bold",
                    "Italic",
                    "Underline",
                    "Superscript",
                    "Subscript",
                    "Link",
                    "Image",
                  ],
                },
              ],
              // toolbarGroups: [
              //   { name: "clipboard", groups: ["clipboard", "undo"] },
              //   {
              //     name: "editing",
              //     groups: ["find", "selection", "spellchecker"],
              //   },
              //   { name: "links" },
              //   { name: "insert" },
              //   { name: "forms" },
              //   { name: "tools" },
              //   { name: "document", groups: ["mode", "document", "doctools"] },
              //   { name: "others" },
              //   "/",
              //   { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
              //   {
              //     name: "paragraph",
              //     groups: ["list", "indent", "blocks", "align", "bidi"],
              //   },
              //   { name: "styles" },
              //   { name: "colors" },
              //   { name: "about" },
              // ],
            }}
          />
          <Form.Item>
            <Button
            className="right-aligned-btn"
              style={{ marginRight: "0" }}
              type="primary"
              variant="contained"
              onClick={this.handleSubmit}
            >
              Post
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { postAnnouncement, clearErrors })(
  AnnouncementPostEditor
);
