import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// css
import "../../css/modal.css";

// Ant Design
import { Button, Input, Form, Modal, Select } from "antd";
const { Option } = Select;

class AddContactModal extends Component {
  //   <div>
  //   <form noValidate onSubmit={this.props.handleSubmit}>
  //       <label htmlFor="contactDepartmentId">Department:</label>
  //       <select
  //         name="contactDepartmentId"
  //         onChange={this.props.handleChange}
  //         value={this.props.contactDepartmentId}
  //       >
  //         {this.props.departments.map((d) => (
  //           <option key={d.id} value={d.id}>
  //             {d.name}
  //           </option>
  //         ))}
  //       </select>
  //       <br />
  //       <label htmlFor="contactName">Name:</label>
  //       <input
  //         id="contactName"
  //         name="contactName"
  //         type="text"
  //         value={this.props.contactName}
  //         onChange={this.props.handleChange}
  //       />
  //       <br />
  //       <label htmlFor="contactImgUrl">ImgUrl:</label>
  //       <input
  //         id="contactImgUrl"
  //         name="contactImgUrl"
  //         type="text"
  //         value={this.props.contactImgUrl}
  //         onChange={this.props.handleChange}
  //       />
  //       <br />
  //       <label htmlFor="contactPhone">Phone:</label>
  //       <input
  //         id="contactPhone"
  //         name="contactPhone"
  //         type="text"
  //         value={this.props.contactPhone}
  //         onChange={this.props.handleChange}
  //       />
  //       <br />
  //       <label htmlFor="contactEmail">Email:</label>
  //       <input
  //         id="contactEmail"
  //         name="contactEmail"
  //         type="text"
  //         value={this.props.contactEmail}
  //         onChange={this.props.handleChange}
  //       />
  //       <br />
  //       <button type="button" onClick={this.props.handleSubmitNewContact}>
  //         Create contact!
  //       </button>
  //       <button type="button" onClick={this.props.handleCancelContactChange}>
  //         Cancel
  //       </button>
  //     </form>
  // </div>
  render() {
    return (
      <Modal
        title="Add New Contact"
        visible={this.props.visible}
        centered={true}
        closable={false}
        footer={[
          <Button key="back" onClick={this.props.handleCancelContactChange}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={this.props.handleSubmitNewContact}
          >
            Save Changes
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item className="requiredInput" label="Department">
            <Select
              name="contactDepartmentId"
              onChange={(departmentId) => {
                var event = {};
                var target = {};
                target.name = "contactDepartmentId";
                target.value = departmentId;
                event.target = target;
                this.props.handleChange(event);
              }}
              value={this.props.contactDepartmentId}
              placeholder="Select a department"
            >
              {this.props.departments.map((d) => (
                <Option key={d.id} value={d.id}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="requiredInput" label="Name">
            <Input
              id="contactName"
              name="contactName"
              type="text"
              value={this.props.contactName}
              onChange={this.props.handleChange}
              placeholder="ex: Jane Doe"
            />
          </Form.Item>
          <Form.Item label="Phone Number">
            <Input
              id="contactPhone"
              name="contactPhone"
              type="text"
              value={this.props.contactPhone}
              onChange={this.props.handleChange}
              placeholder="ex: (123) 456 7890"
            />
          </Form.Item>
          <Form.Item className="requiredInput" label="E-mail">
            <Input
              id="contactEmail"
              name="contactEmail"
              type="text"
              value={this.props.contactEmail}
              onChange={this.props.handleChange}
              placeholder="ex: janedoe@email.com"
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

AddContactModal.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(AddContactModal);
