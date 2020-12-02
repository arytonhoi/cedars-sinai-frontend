// import React, { Component } from "react";
// import "./PostAnn.css";
// //import PropTypes from 'prop-types';

// import { Form, Input, Button } from "antd";

// // Redux stuff
// import { connect } from "react-redux";
// import { postAnnouncement, clearErrors } from "../../redux/actions/dataActions";

// // Editor
// import CKEditor from "ckeditor4-react";

// class PostAnn extends Component {
//   state = {
//     ann: {
//       title: "",
//       author: "Krystal",
//       content: "",
//       isPinned: false,
//     },
//     errors: {},
//   };
//   handleSubmit = (event) => {
//     event.preventDefault();
//     console.log(this.state.ann);
//     this.setState({
//       ...this.state,
//       ann: { ...this.state.ann, isPinned: this.state.ann.isPinned === "on" },
//     });
//     if (this.state.ann.title !== "" && this.state.ann.content !== "") {
//       this.props.postAnnouncement(this.state.ann);
//     } else {
//       this.errors = { error: "Blank post" };
//     }
//   };
//   updateEditor = (event) => {
//     this.setState({
//       ...this.state,
//       ann: { ...this.state.ann, content: event.editor.getData() },
//     });
//   };
//   handleChange = (event) => {
//     this.setState({
//       ...this.state,
//       ann: { ...this.state.ann, [event.target.name]: event.target.value },
//     });
//   };
//   render() {
//     // console.log(this.state);console.log(this.props);
//     // we need removeButtons or else underline will be disabled
//     return (
//       <div className="floating-component">
//         <Form novalidate onFinish={this.handleSubmit}>
//           <h3>Post New Announcement</h3>
//           <Form.Item
//             name="author"
//             rules={[{ required: true, message: "Please input your name." }]}
//           >
//             <Input
//               className="ann-input"
//               name="author"
//               type="text"
//               onChange={this.handleChange}
//               placeholder="Name"
//             />
//           </Form.Item>
//           <Form.Item
//             name="title"
//             rules={[{ required: true, message: "Please input a title." }]}
//           >
//             <Input
//               className="ann-input"
//               name="title"
//               type="text"
//               placeholder="Enter a title..."
//               onChange={this.handleChange}
//             />
//           </Form.Item>
//           <CKEditor
//             name="announce"
//             data="Share an announcement"
//             onChange={this.updateEditor}
//             config={{
//               disallowedContent: "script embed *[on*]",
//               removeButtons: "",
//               toolbarGroups: [
//                 { name: "clipboard", groups: ["clipboard", "undo"] },
//                 {
//                   name: "editing",
//                   groups: ["find", "selection", "spellchecker"],
//                 },
//                 { name: "links", groups: ["links"] },
//                 { name: "insert", groups: ["insert"] },
//                 { name: "forms", groups: ["forms"] },
//                 { name: "tools", groups: ["tools"] },
//                 { name: "document", groups: ["mode", "document", "doctools"] },
//                 "/",
//                 { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
//                 {
//                   name: "paragraph",
//                   groups: ["list", "indent", "blocks", "align", "bidi"],
//                 },
//                 { name: "styles", groups: ["styles"] },
//                 { name: "colors", groups: ["colors"] },
//               ],
//             }}
//           />
//           <div className="ann-form-bottom">
//             <span>
//               Pin post?{" "}
//               <input
//                 type="checkbox"
//                 name="isPinned"
//                 onChange={this.handleChange}
//               />
//             </span>
//             <span>
//               <Button onClick={this.props.onCancel}>Cancel</Button>
//               <Button
//                 disabled={
//                   this.state.ann.title === "" ||
//                   this.state.ann.author === "" ||
//                   this.state.ann.content === ""
//                 }
//                 htmlType="submit"
//                 className="ann-form-submit"
//                 type="primary"
//               >
//                 Post
//               </Button>
//             </span>
//           </div>
//         </Form>
//       </div>
//     );
//   }
// }

// const mapStateToProps = (state) => ({});

// export default connect(mapStateToProps, { postAnnouncement, clearErrors })(
//   PostAnn
// );
